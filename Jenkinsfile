pipeline {
    agent any

    environment {
        FRONTEND_REPO = "hackeduser/pnotes-frontend"
        BACKEND_REPO  = "hackeduser/pnotes-backend"
        FRONTEND_TAG  = "latest"
        BACKEND_TAG   = "latest"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "Cloning repository..."
                git branch: 'main',
                    credentialsId: 'github-cred',
                    url: 'https://github.com/Cj-bidhan/personal-notes.git'
            }
        }

        stage('Docker Login') {
            steps {
                echo "Logging into Docker Hub..."
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Build & Push Frontend Image') {
            steps {
                echo "Building frontend image..."
                sh """
                docker build -t $FRONTEND_REPO:$FRONTEND_TAG ./client
                docker push $FRONTEND_REPO:$FRONTEND_TAG
                """
            }
        }

        stage('Build & Push Backend Image') {
            steps {
                echo "Building backend image..."
                sh """
                docker build -t $BACKEND_REPO:$BACKEND_TAG ./server
                docker push $BACKEND_REPO:$BACKEND_TAG
                """
            }
        }

        stage('Deploy to Server') {
            steps {
                echo "Deploying app to project EC2..."
                sshagent (credentials: ['project-server-ssh']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@3.110.14.32 '
                        cd ~/personal-notes-app &&
                        git pull origin main &&
                        docker-compose -f docker-compose.prod.yml down &&
                        docker-compose -f docker-compose.prod.yml up -d
                    '
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful!"
        }
        failure {
            echo "❌ Pipeline failed. Please check logs."
        }
    }
}
