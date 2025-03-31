const Docker = require('dockerode');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

// Docker container name for docker-mailserver
const DOCKER_CONTAINER = process.env.DOCKER_CONTAINER || 'mailserver';

/**
 * Executes a command in the docker-mailserver container
 * @param {string} command Command to execute
 * @return {Promise<string>} stdout from the command
 */
async function execInContainer(command) {
  try {
    // Get container instance
    const container = docker.getContainer(DOCKER_CONTAINER);
    
    // Create exec instance
    const exec = await container.exec({
      Cmd: ['sh', '-c', command],
      AttachStdout: true,
      AttachStderr: true
    });
    
    // Start exec instance
    const stream = await exec.start();
    
    // Collect output
    return new Promise((resolve, reject) => {
      let stdoutData = '';
      let stderrData = '';
      
      stream.on('data', (chunk) => {
        // Docker multiplexes stdout/stderr in the same stream
        // First 8 bytes contain header, actual data starts at 8th byte
        stdoutData += chunk.slice(8).toString();
      });
      
      stream.on('end', () => {
        resolve(stdoutData);
      });
      
      stream.on('error', (err) => {
        reject(err);
      });
    });
  } catch (error) {
    console.error(`Error executing command in container: ${command}`, error);
    throw error;
  }
}

/**
 * Executes a setup.sh command in the docker-mailserver container
 * @param {string} setupCommand Command to pass to setup.sh
 * @return {Promise<string>} stdout from the command
 */
async function execSetup(setupCommand) {
  // The setup.sh script is usually located at /usr/local/bin/setup.sh or /usr/local/bin/setup in docker-mailserver
  return execInContainer(`/usr/local/bin/setup ${setupCommand}`);
}

// Function to retrieve email accounts
async function getAccounts() {
  try {
    const stdout = await execSetup('email list');
    const accounts = stdout.split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => {
        const email = line.trim();
        return { email, active: true };
      });
    return accounts;
  } catch (error) {
    console.error('Error retrieving accounts:', error);
    throw new Error('Unable to retrieve account list');
  }
}

// Function to add a new email account
async function addAccount(email, password) {
  try {
    await execSetup(`email add ${email} ${password}`);
    return { success: true, email };
  } catch (error) {
    console.error('Error adding account:', error);
    throw new Error('Unable to add email account');
  }
}

// Function to delete an email account
async function deleteAccount(email) {
  try {
    await execSetup(`email del ${email}`);
    return { success: true, email };
  } catch (error) {
    console.error('Error deleting account:', error);
    throw new Error('Unable to delete email account');
  }
}

// Function to retrieve aliases
async function getAliases() {
  try {
    const stdout = await execSetup('alias list');
    const aliases = stdout.split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => {
        const parts = line.split(' -> ');
        return {
          source: parts[0].trim(),
          destination: parts[1].trim()
        };
      });
    return aliases;
  } catch (error) {
    console.error('Error retrieving aliases:', error);
    throw new Error('Unable to retrieve alias list');
  }
}

// Function to add an alias
async function addAlias(source, destination) {
  try {
    await execSetup(`alias add ${source} ${destination}`);
    return { success: true, source, destination };
  } catch (error) {
    console.error('Error adding alias:', error);
    throw new Error('Unable to add alias');
  }
}

// Function to delete an alias
async function deleteAlias(source) {
  try {
    await execSetup(`alias del ${source}`);
    return { success: true, source };
  } catch (error) {
    console.error('Error deleting alias:', error);
    throw new Error('Unable to delete alias');
  }
}

// Function to check server status
async function getServerStatus() {
  try {
    // Get container info
    const container = docker.getContainer(DOCKER_CONTAINER);
    const containerInfo = await container.inspect();
    
    // Check if container is running
    const isRunning = containerInfo.State.Running === true;
    
    let diskUsage = '0%';
    let cpuUsage = '0%';
    let memoryUsage = '0MB';
    
    if (isRunning) {
      // Get container stats
      const stats = await container.stats({ stream: false });
      
      // Calculate CPU usage percentage
      const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
      const systemCpuDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
      const cpuPercent = (cpuDelta / systemCpuDelta) * stats.cpu_stats.online_cpus * 100;
      cpuUsage = `${cpuPercent.toFixed(2)}%`;
      
      // Calculate memory usage
      const memoryUsageBytes = stats.memory_stats.usage;
      memoryUsage = formatMemorySize(memoryUsageBytes);
      
      // For disk usage, we would need to run a command inside the container
      // This could be a more complex operation involving checking specific directories
      // For simplicity, we'll set this to "N/A" or implement a basic check
      diskUsage = 'N/A';
    }
    
    return {
      status: isRunning ? 'running' : 'stopped',
      resources: {
        cpu: cpuUsage,
        memory: memoryUsage,
        disk: diskUsage
      }
    };
  } catch (error) {
    console.error('Error checking server status:', error);
    return {
      status: 'unknown',
      error: error.message
    };
  }
}

// Helper function to format memory size
function formatMemorySize(bytes) {
  if (bytes === 0) return '0B';
  
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + sizes[i];
}

module.exports = {
  getAccounts,
  addAccount,
  deleteAccount,
  getAliases,
  addAlias,
  deleteAlias,
  getServerStatus
};