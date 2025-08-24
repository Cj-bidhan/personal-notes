pipeline {
  agent any
  options {
    timestamps()
    disableConcurrentBuilds()
  }

  environment {
    COMPOSE = "docker-compose.yml"
 
    DOCKERHUB_USER = 'hackeduser'

    FRONTEND_IMAGE = "${DOCKERHUB_USER}/pnotes-frontend"
    BACKEND_IMAGE  = "${DOCKERHUB_USER}/pnotes-backend"

    // ---- Remote deploy target  ----
    APP_HOST       = '3.110.14.32'
    APP_DEPLOY_DIR = '/home/ubuntu/personal-notes-app'
  }

  triggers {
    // Webhook already configured in GitHub → this makes it auto-trigger
    githubPush()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        script {
          env.SHORT_SHA = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
          echo "Using commit SHA: ${env.SHORT_SHA}"
        }
      }
    }

    stage('Docker Login') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
          sh 'echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin'
        }
      }
    }

    stage('Build & Tag Images') {
      parallel {
        stage('Backend') {
          steps {
            sh """
              docker pull ${BACKEND_IMAGE}:latest || true
              docker build -t ${BACKEND_IMAGE}:${SHORT_SHA} -t ${BACKEND_IMAGE}:latest \
                --cache-from ${BACKEND_IMAGE}:latest server
            """
          }
        }
        stage('Frontend') {
          steps {
            sh """
              docker pull ${FRONTEND_IMAGE}:latest || true
              docker build -t ${FRONTEND_IMAGE}:${SHORT_SHA} -t ${FRONTEND_IMAGE}:latest \
                --cache-from ${FRONTEND_IMAGE}:latest client
            """
          }
        }
      }
    }

    stage('Push Images') {
      steps {
        sh """
          docker push ${BACKEND_IMAGE}:${SHORT_SHA}
          docker push ${BACKEND_IMAGE}:latest
          docker push ${FRONTEND_IMAGE}:${SHORT_SHA}
          docker push ${FRONTEND_IMAGE}:latest
        """
      }
    }

    stage('Deploy to App EC2') {
      steps {
        
        sshagent(credentials: ['project-server-ssh']) {
          sh """
            ssh -o StrictHostKeyChecking=no ubuntu@${APP_HOST} '
              set -euo pipefail
              cd ${APP_DEPLOY_DIR}

              cat > .env.deploy <<EOT
BACKEND_IMAGE=${BACKEND_IMAGE}
BACKEND_TAG=${SHORT_SHA}
FRONTEND_IMAGE=${FRONTEND_IMAGE}
FRONTEND_TAG=${SHORT_SHA}
EOT

              if docker compose version >/dev/null 2>&1; then
                COMPOSE="docker compose"
              elif docker-compose version >/dev/null 2>&1; then
                COMPOSE="docker-compose"
              else
                echo "ERROR: Docker Compose not found on target host." >&2
                exit 1
              

              

              set -a
              . ./.env.deploy
              set +a

              $COMPOSE -f docker-compose.prod.yml pull
              $COMPOSE -f docker-compose.prod.yml up -d --remove-orphans
            '
          """
        }
      }
    }
  }

  post {
    always {
      sh 'docker logout || true'
    }
    success {
      echo "✅ Deployed: ${FRONTEND_IMAGE}:${SHORT_SHA} & ${BACKEND_IMAGE}:${SHORT_SHA}"
    }
    failure {
      echo "❌ Build/Deploy failed. Check console logs."
    }
  }
}
