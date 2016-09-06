/// <reference path="../typings/index.d.ts" />

var path:any = require('path');
var _:any = require('lodash');
var async:Async = require('async');
var gulp:any = require('gulp');

module.exports = function (moduleDef:any, options:any, callback:Function):void {

    var notify:Function = console.log;
    var onError:Function = console.error;

    var cwd = path.join(__dirname);
    var appRoot = path.join(cwd, '../../../');
    var stInstallerRoot:string = path.join(cwd, '../');

    // local dependencies from installer
    var fsePath:string = path.join(stInstallerRoot, 'node_modules', 'fs-extra');
    var fse:any = require(fsePath);


    var clientSourcePath:string = path.join(cwd, '../../', moduleDef.name, 'client/styles');
    var clientDestinationRoot:string = path.join(appRoot, 'assets/styles/dependencies');
    var clientDestinationPath:string = path.join(clientDestinationRoot, moduleDef.name);

    async.series(
        [
            function (next:Function):void {
                fse.access(clientSourcePath, fse.R_OK, function (err):void {
                    if (err) {
                        return callback();
                    }
                    next();
                })
            }
            ,
            function (next:Function):void {
                fse.ensureDir(clientDestinationPath, function (err):void {
                    next(err);
                })
            }
            ,
            function (next:Function):void {

                var fileTypesExpr:string = 'css';

                function copyFunc(done:Function) {
                    gulp
                        .src(clientSourcePath + '/**/*.+('+ fileTypesExpr +')')
                        .pipe(
                            gulp
                                .dest(clientDestinationPath)
                                .on('end', function () {
                                        if (done) {
                                            done();
                                        }
                                    }
                                )
                        );
                }
                copyFunc(function () {
                    next();
                });
            }
        ],
        function (err:Error):void {
            if (!err) {
                notify(moduleDef.name + ' client styles successfully installed into... ' + clientDestinationPath);
            }
            else {
                notify(moduleDef.name +' styles could not be installed into... ' + clientDestinationPath);
            }
            callback(err);
        }
    );
};