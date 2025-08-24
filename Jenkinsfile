pipeline {
    agent any

    environment {
        FRONTEND_REPO = "hackeduser/pnotes-frontend"
        BACKEND_REPO  = "hackeduser/pnotes-backend"
        DEPLOY_SERVER = "ubuntu@<3.110.14.32>"
        DEPLOY_PATH   = "~/personal-notes-app"
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

        stage('Build & Push Frontend Image') {
            steps {
                echo "Building and pushing frontend image..."
                sh """
                  docker build -t ${FRONTEND_REPO}:latest ./client
                  docker login -u $DOCKER_HUB_USER -p $DOCKER_HUB_PASS
                  docker push ${FRONTEND_REPO}:latest
                """
            }
        }

        stage('Build & Push Backend Image') {
            steps {
                echo "Building and pushing backend image..."
                sh """
                  docker build -t ${BACKEND_REPO}:latest ./server
                  docker login -u $DOCKER_HUB_USER -p $DOCKER_HUB_PASS
                  docker push ${BACKEND_REPO}:latest
                """
            }
        }

        stage('Deploy to Server') {
            steps {
                echo "Deploying to EC2..."
                sshagent(['project-server-ssh']) {
                    sh """
                      ssh -o StrictHostKeyChecking=no ${DEPLOY_SERVER} '
                        cd ${DEPLOY_PATH} &&
                        docker-compose -f docker-compose.prod.yml down || true &&
                        docker-compose -f docker-compose.prod.yml pull &&
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
