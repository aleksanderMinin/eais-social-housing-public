# Docker image which will be used.
# Version of ember-cli can be also retrieved from package.json by the following command: (Get-Content package.json | ConvertFrom-Json)."devDependencies"."ember-cli"
$ember_cli_image_name = "danlynn/ember-cli:3.5.1"

# Check if docker is installed.
$docker_version = $null
try {
  $docker_version = docker version 2>&1
} catch [System.Management.Automation.CommandNotFoundException] {
  $docker_version = $null
}

$is_docker_installed = !($docker_version -eq $null)
if (!$is_docker_installed) {
  Write-Output "Docker isn't installed on your machine yet, please install and confugire docker first"
  Write-Output "Visit https://www.docker.com/get-started and follow instructions for your operating system"
  Break
}

# Check if docker is running.
$docker_version_stdout = $docker_version | ?{ $_ -isnot [System.Management.Automation.ErrorRecord] }
$docker_version_stderr = $docker_version | ?{ $_ -is [System.Management.Automation.ErrorRecord] }

$is_docker_running = !([string]::IsNullOrEmpty($docker_version_stdout)) -And ([string]::IsNullOrEmpty($docker_version_stderr))
if (!$is_docker_running) {
  $docker_executable_path = ((Get-Command docker).Path -split "Resources\\bin\\docker.exe")[0]
  Write-Output "Docker is installed on your machine, but it isn't running at now, please start docker first"
  Write-Output "Visit ${docker_executable_path} and run 'Docker for Windows.exe'"
  Break
}

# Check if docker image is pulled.
$ember_cli_image_id = docker image ls --quiet "$ember_cli_image_name"
$is_ember_cli_image_pulled = !([string]::IsNullOrEmpty($ember_cli_image_id))
if (!$is_ember_cli_image_pulled) {
  Write-Output "Docker image '${ember_cli_image_name}' isn't pulled yet"
  Write-Output "Pulling docker image '${ember_cli_image_name}' from docker hub"
  Write-Output ""
  
  # Pull docker image.
  $docker_pull_stdout = $null
  docker pull "${ember_cli_image_name}" | Tee-Object -Variable docker_pull_stdout

  $is_ember_cli_image_pulled = !([string]::IsNullOrEmpty($docker_pull_stdout))
  if ($is_ember_cli_image_pulled) {
    $ember_cli_image_id = docker image ls --quiet "${ember_cli_image_name}"
    Write-Output ""
  }
}

# Run pulled docker image.
if ($is_ember_cli_image_pulled) {
  Write-Output "Running docker image '${ember_cli_image_name}'"
  Write-Output ""
  Write-Output "Run 'exit' command to stop docker image"
  Write-Output "Run 'ember server' command to start ember application on localhost:4200"
  Write-Output "Press 'Ctrl+C' to stop server on localhost:4200 if started"
  docker run --rm -ti -v ${PWD}:/myapp -p 4200:4200 -p 7020:7020 -p 7357:7357 "${ember_cli_image_name}" bash
}
