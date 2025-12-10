import AppEnvConfig from './.application/app.components/app.env.config'
import AppEventPublisher from './.application/app.components/app.event.publisher'
import AppInfrastructure from './.application/app.components/app.infra'
import AppFactories from './.application/app.components/app.factories'
import AppRepositories from './.application/app.components/app.repositories'
import AppServices from './.application/app.components/app.services'
import AppUsecases from './.application/app.components/app.usecases'
import ExpressRest from './.application/app.express.rest'
import AppKafkaConsumer from './.application/app.kafka.consumer'

async function startApp() {  // ✅ Async function
    try {
        console.log('🚀 Starting application...');

        // 1. Load configuration
        const appConfig = new AppEnvConfig(process.env['node.env']);
        console.log(`📁 Environment: ${process.env['node.env'] || 'local'}`);

        // 2. Initialize & prepare infrastructure (ASYNC!)
        const appInfra = new AppInfrastructure(appConfig);
        await appInfra.prepareInfrastructure();  // ✅ AWAIT THIS!
        console.log('✅ Infrastructure ready');

        // 3. Build application layers
        const appEventPublisher = new AppEventPublisher(appConfig, appInfra);
        const appFactories = new AppFactories();
        const appRepositories = new AppRepositories(appInfra, appFactories);
        const appServices = new AppServices(appInfra, appEventPublisher, appRepositories);
        const appUsecases = new AppUsecases(
            appInfra,
            appEventPublisher,
            appRepositories,
            appServices,
            appFactories,
            appConfig
        );

        // 4. Start HTTP Server
        const expressRest = new ExpressRest(appConfig, appInfra, appUsecases, appFactories);
        expressRest.useGracefulShutdown();  // ✅ Register signal handlers
        expressRest.start();  // ✅ Start Express (sync)
        console.log(`🌐 HTTP server started on port ${appConfig.restAppConfig().port()}`);

        // 5. Start Kafka Consumer (ASYNC!)
        const kafkaConsumerWorker = new AppKafkaConsumer(appInfra, appConfig, appRepositories);
        await kafkaConsumerWorker.startConsumer();  // ✅ AWAIT THIS!
        console.log('📡 Kafka consumer started');

        console.log('🎉 Application started successfully!');

    } catch (error) {
        console.error('💥 Failed to start application:', error);
        process.exit(1);  // Exit dengan error code
    }
}

// Start application
startApp();

// Global error handlers (catch unhandled errors)
process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    process.exit(1);
});