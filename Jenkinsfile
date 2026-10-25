
pipeline {
    agent any

    environment {
        CI = 'true'
        PATH = "/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"
    }

    stages {

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

        stage('Run Regression Tests') {
            when {
                branch 'main'
            }
            steps {
                sh 'npm run test:regression'
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

            publishHTML(target: [
            reportDir: 'playwright-report',
            reportFiles: 'index.html',
            reportName: 'Playwright HTML Report',
            keepAll: true,
            alwaysLinkToLastBuild: true,
            allowMissing: false
        ])
        }
    }
}
