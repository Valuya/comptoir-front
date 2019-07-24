
pipeline {
    agent any
    parameters {
        booleanParam(name: 'SKIP_TESTS', defaultValue: false, description: 'Skip tests')
        string(name: 'ALT_DEPLOYMENT_REPOSITORY', defaultValue: '', description: 'Alternative deployment repo')
    }
    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    stages {
        stage ('Build') {
            steps {
                withCredentials([usernameColonPassword(credentialsId: 'nexus-basic-auth', variable: 'NEXUS_BASIC_AUTH')]) {
                    nodejs(nodeJSInstallationName: 'node 10', configId: 'npm-global-config') {   catchError {
                         ansiColor('xterm') {
                               sh '''
                                   npm install
                                   ./node_modules/.bin/ng build --prod
                               '''
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
