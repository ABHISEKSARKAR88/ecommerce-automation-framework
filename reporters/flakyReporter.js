
class FlakyReporter {
  constructor() {
    this.testResults = new Map();
  }

  onTestEnd(test, result) {
    const testId = test.id;

    if (!this.testResults.has(testId)) {
      this.testResults.set(testId, {
        title: test.title,
        attempts: [],
      });
    }

    this.testResults.get(testId).attempts.push({
      status: result.status,
      retry: result.retry,
    });
  }

  onEnd() {
    let passedTests = 0;
    let flakyTests = 0;
    let failedTests = 0;
    let totalFailedAttempts = 0;

    console.log('\n========== TEST EXECUTION SUMMARY ==========');

    for (const test of this.testResults.values()) {
      const attempts = test.attempts;

      const failedAttempts = attempts.filter(
        attempt => ['failed', 'timedOut', 'interrupted'].includes(attempt.status)
        );

      totalFailedAttempts += failedAttempts.length;

      const finalAttempt = attempts[attempts.length - 1];

      if (finalAttempt.status === 'passed') {
        if (failedAttempts.length > 0) {
          flakyTests++;

          console.log(
            `FLAKY: ${test.title} | Passed on retry ${finalAttempt.retry}`
          );
        } else {
          passedTests++;
        }
      } else if (
            ['failed', 'timedOut', 'interrupted'].includes(finalAttempt.status)
            ) {
        failedTests++;

        console.log(`FAILED: ${test.title}`);
      }
    }

    console.log('\n--------------- FINAL COUNTS ---------------');
    console.log(`Passed tests: ${passedTests}`);
    console.log(`Flaky tests: ${flakyTests}`);
    console.log(`Permanently failed tests: ${failedTests}`);
    console.log(`Total failed attempts: ${totalFailedAttempts}`);
    console.log('============================================\n');
  }
}

module.exports = FlakyReporter;
