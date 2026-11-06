
pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        CI = 'true'
        PATH = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:${env.PATH}"
    }

    stages {
        stage('Clean Reports') {
            steps {
                sh '''
                    rm -rf blob-reports
                    rm -rf merged-blob-reports
                    rm -rf playwright-report
                    rm -rf test-results
                    rm -rf shard-reports

                    rm -f shard-1-junit.xml
                    rm -f shard-2-junit.xml
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    npm ci
                    npx playwright install chromium
                '''
            }
        }

        stage('Prepare Authentication') {
            steps {
                sh '''
                    mkdir -p playwright/.auth
                    npx playwright test --project=setup
                '''
            }
        }

        stage('Smoke Tests') {
            when {
                not {
                    branch 'main'
                }
            }

            parallel {
                stage('Smoke Shard 1') {
                    steps {
                        catchError(
                            buildResult: 'FAILURE',
                            stageResult: 'FAILURE'
                        ) {
                            sh '''
                                PLAYWRIGHT_BLOB_OUTPUT_DIR=blob-reports/shard-1 \
                                PLAYWRIGHT_JUNIT_OUTPUT_NAME=shard-1-junit.xml \
                                npx playwright test \
                                    --project=chromium \
                                    --grep "@smoke" \
                                    --shard=1/2 \
                                    --workers=2 \
                                    --no-deps \
                                    --output=test-results/shard-1 \
                                    --reporter=blob,junit
                            '''
                        }
                    }
                }

                stage('Smoke Shard 2') {
                    steps {
                        catchError(
                            buildResult: 'FAILURE',
                            stageResult: 'FAILURE'
                        ) {
                            sh '''
                                PLAYWRIGHT_BLOB_OUTPUT_DIR=blob-reports/shard-2 \
                                PLAYWRIGHT_JUNIT_OUTPUT_NAME=shard-2-junit.xml \
                                npx playwright test \
                                    --project=chromium \
                                    --grep "@smoke" \
                                    --shard=2/2 \
                                    --workers=2 \
                                    --no-deps \
                                    --output=test-results/shard-2 \
                                    --reporter=blob,junit
                            '''
                        }
                    }
                }
            }
        }

        stage('Regression Tests') {
            when {
                branch 'main'
            }

            parallel {
                stage('Regression Shard 1') {
                    steps {
                        catchError(
                            buildResult: 'FAILURE',
                            stageResult: 'FAILURE'
                        ) {
                            sh '''
                                PLAYWRIGHT_BLOB_OUTPUT_DIR=blob-reports/shard-1 \
                                PLAYWRIGHT_JUNIT_OUTPUT_NAME=shard-1-junit.xml \
                                npx playwright test \
                                    --project=chromium \
                                    --grep "@regression" \
                                    --shard=1/2 \
                                    --workers=2 \
                                    --no-deps \
                                    --output=test-results/shard-1 \
                                    --reporter=blob,junit
                            '''
                        }
                    }
                }

                stage('Regression Shard 2') {
                    steps {
                        catchError(
                            buildResult: 'FAILURE',
                            stageResult: 'FAILURE'
                        ) {
                            sh '''
                                PLAYWRIGHT_BLOB_OUTPUT_DIR=blob-reports/shard-2 \
                                PLAYWRIGHT_JUNIT_OUTPUT_NAME=shard-2-junit.xml \
                                npx playwright test \
                                    --project=chromium \
                                    --grep "@regression" \
                                    --shard=2/2 \
                                    --workers=2 \
                                    --no-deps \
                                    --output=test-results/shard-2 \
                                    --reporter=blob,junit
                            '''
                        }
                    }
                }
            }
        }

        stage('Merge Playwright Reports') {
            steps {
                sh '''
                    mkdir -p merged-blob-reports

                    if [ -d blob-reports ]; then
                        find blob-reports -type f -name "*.zip" \
                            -exec cp {} merged-blob-reports/ \\;
                    fi

                    REPORT_COUNT=$(find merged-blob-reports \
                        -type f -name "*.zip" | wc -l | tr -d ' ')

                    echo "Blob reports found: ${REPORT_COUNT}"

                    if [ "$REPORT_COUNT" -gt 0 ]; then
                        npx playwright merge-reports \
                            --reporter html \
                            ./merged-blob-reports
                    else
                        echo "No Blob reports available to merge."
                    fi
                '''
            }
        }
    }

    post {
        always {
            script {
                junit(
                    testResults: '*-junit.xml',
                    allowEmptyResults: true
                )

                archiveArtifacts(
                    artifacts: 'playwright-report/**,blob-reports/**/*.zip,merged-blob-reports/**,*-junit.xml',
                    allowEmptyArchive: true
                )

                publishHTML(target: [
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright HTML Report'
                ])
            }
        }
    }
}
