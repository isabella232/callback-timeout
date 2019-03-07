var test         = require('tape')
var timeout      = require('..')
var TimeoutError = require('../errors').TimeoutError

test('with timeouts given', function _ (t) {
  t.plan(6)

  function doSomethingFast (cb) { setTimeout(cb, 100) }
  function doSomethingSlow (cb) { setTimeout(cb, 2000) }

  doSomethingFast(timeout(function doSomethingFastHandler (err) {
    if (err)
      t.fail('doSomethingFastHandler got an error')
    else
      t.pass('doSomethingFastHandler did not get an error')
  }, 1000))

  doSomethingSlow(timeout(function doSomethingSlowHandler (err) {
    if (err)
      t.pass('doSomethingSlowHandler got error')
    else
      t.fail('doSomethingSlowHandler did not get an error')
  }, 1000))

  doSomethingSlow(timeout(function (err) { // eslint-disable-line func-names
    t.ok(err.message.indexOf('anonymous') > -1,
      'callback err has proper message for anonymous functions')
    t.ok(err instanceof TimeoutError, 'error is a TimeoutError')
    t.equals(err.name, 'TimeoutError', 'error.name is TimeoutError')
  }, 250))

  doSomethingSlow(timeout(function (err) { // eslint-disable-line func-names
    t.ok(err === null,
      'null returned in case of case error message being set to false')
  }, 250, false))
})

