
pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        CI = 'true'
        TEST_ENV = 'local'

        PATH = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:${env.PATH}"

        DB_HOST = 'localhost'
        DB_PORT = '5432'
        DB_NAME = 'ecommerce_test'
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
                    rm -f api-smoke-junit.xml
                    rm -f api-regression-junit.xml
                    rm -f db-junit.xml
                    rm -f integration-junit.xml

                    rm -f backend.log
                    rm -f backend.pid
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

        // ----------------------------------------
        // UI SMOKE TESTS - NON MAIN BRANCHES
        // ----------------------------------------

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

        // ----------------------------------------
        // UI REGRESSION TESTS - MAIN
        // ----------------------------------------

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

        // ----------------------------------------
        // API SMOKE TESTS - NON MAIN BRANCHES
        // ----------------------------------------

        stage('API Smoke Tests') {
            when {
                not {
                    branch 'main'
                }
            }

            steps {
                catchError(
                    buildResult: 'FAILURE',
                    stageResult: 'FAILURE'
                ) {
                    sh '''
                        PLAYWRIGHT_BLOB_OUTPUT_DIR=blob-reports/api-smoke \
                        PLAYWRIGHT_JUNIT_OUTPUT_NAME=api-smoke-junit.xml \
                        npx playwright test \
                            --project=api \
                            --grep "@smoke" \
                            --workers=2 \
                            --output=test-results/api-smoke \
                            --reporter=blob,junit
                    '''
                }
            }
        }

        // ----------------------------------------
        // API REGRESSION TESTS - MAIN
        // ----------------------------------------

        stage('API Regression Tests') {
            when {
                branch 'main'
            }

            steps {
                catchError(
                    buildResult: 'FAILURE',
                    stageResult: 'FAILURE'
                ) {
                    sh '''
                        PLAYWRIGHT_BLOB_OUTPUT_DIR=blob-reports/api-regression \
                        PLAYWRIGHT_JUNIT_OUTPUT_NAME=api-regression-junit.xml \
                        npx playwright test \
                            --project=api \
                            --grep "@regression" \
                            --workers=2 \
                            --output=test-results/api-regression \
                            --reporter=blob,junit
                    '''
                }
            }
        }

        // ----------------------------------------
        // POSTGRESQL DATABASE TESTS
        // ----------------------------------------

        stage('Database Tests') {

            steps {
                catchError(
                    buildResult: 'FAILURE',
                    stageResult: 'FAILURE'
                ) {

                    withCredentials([
                        usernamePassword(
                            credentialsId: 'ecommerce-postgres-credentials',
                            usernameVariable: 'DB_USER',
                            passwordVariable: 'DB_PASSWORD'
                        )
                    ]) {

                        sh '''
                            PLAYWRIGHT_BLOB_OUTPUT_DIR=blob-reports/db \
                            PLAYWRIGHT_JUNIT_OUTPUT_NAME=db-junit.xml \
                            npx playwright test \
                                --project=db \
                                --workers=1 \
                                --output=test-results/db \
                                --reporter=blob,junit
                        '''
                    }
                }
            }
        }

        // ----------------------------------------
        // API TO DATABASE INTEGRATION TESTS
        // ----------------------------------------

        stage('API DB Integration Tests') {

            steps {
                catchError(
                    buildResult: 'FAILURE',
                    stageResult: 'FAILURE'
                ) {

                    withCredentials([
                        usernamePassword(
                            credentialsId: 'ecommerce-postgres-credentials',
                            usernameVariable: 'DB_USER',
                            passwordVariable: 'DB_PASSWORD'
                        )
                    ]) {

                        sh '''
                            set -e

                            echo "Starting Express backend..."

                            TEST_ENV=local node src/backend/server.js \
                                > backend.log 2>&1 &

                            BACKEND_PID=$!

                            cleanup_backend() {
                                echo "Stopping Express backend..."

                                if kill -0 "$BACKEND_PID" 2>/dev/null; then
                                    kill "$BACKEND_PID"
                                    wait "$BACKEND_PID" || true
                                fi

                                rm -f backend.pid
                            }

                            trap cleanup_backend EXIT

                            echo "$BACKEND_PID" > backend.pid

                            echo "Waiting for backend readiness..."

                            READY=false

                            for attempt in $(seq 1 30); do

                                HTTP_STATUS=$(curl \
                                    -sS \
                                    -o /dev/null \
                                    -w "%{http_code}" \
                                    http://localhost:3000/api/products/999999999 \
                                    || true)

                                if [ "$HTTP_STATUS" = "200" ] || \
                                   [ "$HTTP_STATUS" = "404" ]; then

                                    READY=true
                                    break
                                fi

                                sleep 1
                            done

                            if [ "$READY" != "true" ]; then
                                echo "Backend failed to start."

                                cat backend.log

                                exit 1
                            fi

                            echo "Backend is ready."

                            PLAYWRIGHT_BLOB_OUTPUT_DIR=blob-reports/integration \
                            PLAYWRIGHT_JUNIT_OUTPUT_NAME=integration-junit.xml \
                            npx playwright test \
                                --project=integration \
                                --workers=2 \
                                --output=test-results/integration \
                                --reporter=blob,junit

                            echo "Integration tests completed."
                        '''
                    }
                }
            }
        }

        // ----------------------------------------
        // MERGE PLAYWRIGHT BLOB REPORTS
        // ----------------------------------------

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

    // ----------------------------------------
    // POST BUILD ACTIONS
    // ----------------------------------------

    post {

        always {

            script {

                junit(
                    testResults: 'test-results/*-junit.xml',
                    allowEmptyResults: true
                )

                archiveArtifacts(
                    artifacts: 'playwright-report/**,blob-reports/**/*.zip,merged-blob-reports/**,test-results/*-junit.xml,backend.log',
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
