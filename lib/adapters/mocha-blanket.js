(function() {

    if(!mocha) {
        throw new Exception("mocha library does not exist in global namespace!");
    }


    /*
     * Mocha Events:
     *
     *   - `start`  execution started
     *   - `end`  execution complete
     *   - `suite`  (suite) test suite execution started
     *   - `suite end`  (suite) all tests (and sub-suites) have finished
     *   - `test`  (test) test execution started
     *   - `test end`  (test) test completed
     *   - `hook`  (hook) hook execution started
     *   - `hook end`  (hook) hook complete
     *   - `pass`  (test) test passed
     *   - `fail`  (test, err) test failed
     *
     */

    var originalReporter = mocha._reporter;

    var blanketReporter = function(runner) {
            runner.on('start', function() {
                blanket.setupCoverage();
            });

            runner.on('end', function() {
                blanket.testEvents.onTestsDone();
            });

            runner.on('suite', function() {
                blanket.testEvents.onModuleStart();
            });

            runner.on('test', function() {
                blanket.testEvents.onTestStart();
            });

            runner.on('test end', function(test) {
                blanket.testEvents.onTestDone(test.parent.tests.length, test.state === 'passed');
            });

            //I dont know why these became global leaks 
            runner.globals(['stats', 'failures', 'runner']);

            originalReporter(runner);
        };

    mocha.reporter(blanketReporter);
    blanket.testEvents.beforeStartTestRunner({
        callback: mocha.run
    });
})();