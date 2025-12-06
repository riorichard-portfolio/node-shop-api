import express, { Express } from 'express'

import AppUsecases from './app.components/app.usecases'
import AppInfrastructure from './app.components/app.infra'
import AppEnvConfig from './app.components/app.env.config'

import ExpressMiddlewares from '../express.http/express.middlewares'
import AuthHandler from '../express.http/express.handlers/auth.handler'
import AppFactories from './app.components/app.factories'

const loginAuthRoute = '/auth/login'
const registerAuthRoute = '/auth/register'
const refreshAuthRoute = '/auth/refresh'

const noRunningExpressApp = 'graceful shut down error: no running express app , please start express rest first'

export default class ExpressRest {
    private readonly expressApp: Express
    private readonly jsonParsesMiddleware = express.json()
    private readonly middlewares: ExpressMiddlewares
    private readonly authHandler: AuthHandler
    private runningExpressApp: any = null
    constructor(
        private readonly appConfig: AppEnvConfig,
        private readonly appInfra: AppInfrastructure,
        appUsecases: AppUsecases,
        appFactories: AppFactories
    ) {
        this.expressApp = express()
        this.middlewares = new ExpressMiddlewares(
            appInfra.authJwt(),
            appInfra.localUserRateLimiter()
        )
        this.authHandler = new AuthHandler(
            appFactories.authInputDTOFactory(),
            appUsecases.authUsecase()
        )

        this.expressApp.use(this.jsonParsesMiddleware)

        this.expressApp.post(loginAuthRoute, this.authHandler.login)
        this.expressApp.post(registerAuthRoute, this.authHandler.register)
        this.expressApp.get(
            refreshAuthRoute,
            this.middlewares.refreshJwtMiddleware,
            this.authHandler.refreshToken
        )

        this.expressApp.use(this.middlewares.accessJwtMiddleware)

        this.expressApp.use(this.middlewares.exceptionMiddleware)
    }

    public start() {
        this.runningExpressApp = this.expressApp.listen(this.appConfig.restAppConfig().port(), () => {
            console.log(`express app running on port: ${this.appConfig.restAppConfig().port()}`)
        })
    }

    private gracefulShutdown = () => {
        if (this.runningExpressApp == null) {
            throw (noRunningExpressApp)
        }
        this.runningExpressApp.close(() => {
            console.log('close express app....')
        })
        this.appInfra.stopInfra()
        console.log('sucess gracefully shutdown the app infrastrcuture')
    }

    public useGracefulShutdown() {
        process.on('SIGTERM', this.gracefulShutdown);
        process.on('SIGINT', this.gracefulShutdown);
        process.on('SIGUSR2', this.gracefulShutdown);
    }
}