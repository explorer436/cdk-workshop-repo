package handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class HelloHandler implements RequestHandler {
	
	Gson gson = new GsonBuilder().setPrettyPrinting().create();
	
	@Override
	public Object handleRequest(Object input, Context context) {
		LambdaLogger logger = context.getLogger();
	    String response = new String("200 OK");
	    // log execution details
	    logger.log("ENVIRONMENT VARIABLES: " + gson.toJson(System.getenv()));
	    logger.log("CONTEXT: " + gson.toJson(context));
	    // process event
	    logger.log("EVENT: " + gson.toJson(input));
	    logger.log("EVENT TYPE: " + input.getClass().toString());
	    return response;
	}

}
