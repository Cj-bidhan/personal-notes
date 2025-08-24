pipeline {
    agent any

    environment {
        FRONTEND_REPO = 'hackeduser/pnotes-frontend'
        BACKEND_REPO  = 'hackeduser/pnotes-backend'
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Cloning repository...'
                git branch: 'main', url: 'https://github.com/Cj-bidhan/personal-notes.git'
            }
        }

        stage('Build & Push Frontend Image') {
            steps {
                script {
                    echo 'Building and pushing frontend image...'
                    def frontendImage = docker.build("${FRONTEND_REPO}:latest", "./client")
                    frontendImage.push("latest")
                }
            }
        }

        stage('Build & Push Backend Image') {
            steps {
                script {
                    echo 'Building and pushing backend image...'
                    def backendImage = docker.build("${BACKEND_REPO}:latest", "./server")
                    backendImage.push("latest")
                }
            }
        }

        stage('Deploy to Server') {
            steps {
                echo 'Deploying latest containers to main project server...'
                sshagent (credentials: ['project-server-ssh']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ubuntu@<3.110.14.32> "
                        cd ~/personal-notes && \
                        docker compose pull && \
                        docker compose up -d --remove-orphans
                    "
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed. Please check the logs.'
        }
    }
}
