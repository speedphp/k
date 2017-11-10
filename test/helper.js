'use strict'

const exec = require('child_process').exec
const path = require('path')
const assert = require('assert')
const cwd = process.cwd()

var serve
module.exports.createTmpApp = (done) => {
    let command_path = path.join(__dirname, "../lib/command.js")
    let lib_path = path.join(__dirname, "../main.js")

    exec('node ' + command_path + ' new -d "tmp" -l "' + lib_path + '" appname', (error, stdout, stderr) => {
        assert(!error)
        assert(!stderr)
        done()
    })
}

module.exports.getApp = (lib_path, config, base_dir) => {
    const speedjs = require(lib_path)
    const Koa = require('koa')
    const app = new Koa()
    return speedjs(app, config, base_dir)
}

module.exports.runDefaultApp = (lib_path) => {
    let config_custom = require(cwd + '/tmp/app/config.js')
    const speedjs = require(lib_path)
    const Koa = require('koa')
    return speedjs(new Koa(), config_custom, cwd + '/tmp').listen()
}
