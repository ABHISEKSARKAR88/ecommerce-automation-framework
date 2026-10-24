
pipeline {
    agent any

    environment {
    CI = 'true'
    PATH = "/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"
}

    stages {
        stage('Diagnose Environment') {
            steps {
                sh '''
                    echo "PATH=$PATH"
                    echo "HOME=$HOME"
                    command -v node || true
                    command -v npm || true
                    /usr/local/bin/node --version
                    /usr/local/bin/npm --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install chromium'
            }
        }

        stage('Run Smoke Tests') {
            steps {
                sh 'npm run test:smoke'
            }
        }
    }

    post {
        always {
            script {
                if (fileExists('test-results/junit.xml')) {
                    junit 'test-results/junit.xml'
                } else {
                    echo 'JUnit report was not generated.'
                }
            }

            archiveArtifacts(
                artifacts: 'playwright-report/**, test-results/**',
                allowEmptyArchive: true
            )
        }
    }
}
