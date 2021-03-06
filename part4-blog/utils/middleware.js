const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const tokenExtractor = (request, response, next) => {
	const authorization = request.get('authorization')
	if (authorization && authorization.toLowerCase().startsWith('bearer ')){
		const token = authorization.substring(7)
		request.token = token
	} else {
		const token = request.get('authorization')
	}
	
	
	
	next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
	if (error.name === 'ValidationError'){
		response.status(400).send({ error: error.message })
	} else if (error.name ==='BadRequest'){
		response.status(400).send({ error: error.message })
	}
	if (process.env.NODE_ENV !== 'test') {
		logger.error(error.message)
	}
  
  next(error)
}

module.exports = {
  unknownEndpoint,
	tokenExtractor,
	requestLogger,
  errorHandler
}