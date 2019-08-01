
pipeline {
    agent any
    parameters {
        booleanParam(name: 'SKIP_TESTS', defaultValue: false, description: 'Skip tests')
        string(name: 'ALT_DEPLOYMENT_REPOSITORY', defaultValue: '', description: 'Alternative deployment repo')
        string(name: 'ENV', defaultValue: 'production', description: 'Environment')
    }
    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    stages {
        stage ('Build') {
            environment {
                BUILD_ENV = sh(script: """ #!/bin/bash
                  [[ \"${env.GIT_BRANCH}\" = \"rc\" ]] && echo 'dev' || echo ${params.ENV}
               """, returnStdout: true)
            }
            steps {
                withCredentials([usernameColonPassword(credentialsId: 'nexus-basic-auth', variable: 'NEXUS_BASIC_AUTH')]) {
                    nodejs(nodeJSInstallationName: 'node 10', configId: 'npm-global-config') {   catchError {
                         ansiColor('xterm') {

                            sh """
                               npm install || exit 1
                               ./node_modules/.bin/ng build --c $BUILD_ENV || exit 1
                            """
                         }
                    }}
                }
                stash includes: 'Dockerfile,docker/**,dist/**', name: 'docker-dist'
            }
        }
        stage ('Build docker image') {
            steps {
                unstash 'docker-dist'
                sh '''
                    export COMMIT="$(git rev-parse --short HEAD)"
                    docker build \
                      --tag comptoir-front-jenkins-build:${COMMIT} \
                      -f Dockerfile \
                      .
                    docker tag comptoir-front-jenkins-build:${COMMIT} docker.valuya.be/comptoir-front:latest
                    docker push docker.valuya.be/comptoir-front:latest
                '''
            }
        }
    }
}
