pipeline {
  agent any
  options {
    timestamps()                // Add timestamps to logs
    disableConcurrentBuilds()   // Prevent overlapping builds
  }

  environment {
    DOCKERHUB_USER   = 'hackeduser'

    FRONTEND_IMAGE   = "${DOCKERHUB_USER}/pnotes-frontend"
    BACKEND_IMAGE    = "${DOCKERHUB_USER}/pnotes-backend"

    APP_HOST         = '3.110.14.32'
    APP_DEPLOY_DIR   = '/home/ubuntu/personal-notes-app'
  }

  triggers {
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
              set -e
              cd ${APP_DEPLOY_DIR}

              echo "BACKEND_IMAGE=${BACKEND_IMAGE}"   >  .env.deploy
              echo "BACKEND_TAG=${SHORT_SHA}"        >> .env.deploy
              echo "FRONTEND_IMAGE=${FRONTEND_IMAGE}" >> .env.deploy
              echo "FRONTEND_TAG=${SHORT_SHA}"       >> .env.deploy

              docker compose --env-file .env.deploy -f docker-compose.prod.yml pull
              docker compose --env-file .env.deploy -f docker-compose.prod.yml up -d --remove-orphans
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
      echo "✅ Deployment successful: ${FRONTEND_IMAGE}:${SHORT_SHA} & ${BACKEND_IMAGE}:${SHORT_SHA}"
    }
    failure {
      echo "❌ Build/Deploy failed. Check console logs."
    }
  }
}
