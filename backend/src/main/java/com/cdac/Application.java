package com.cdac;

import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.modelmapper.convention.NameTokenizers;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;
import io.github.cdimascio.dotenv.Dotenv;


@SpringBootApplication // includes @Configuration
@ComponentScan(basePackages = { "com.cdac", "com.tradestorm" })
@EnableJpaRepositories(basePackages = "com.tradestorm.repository")
@EnableScheduling
@EnableCaching
public class Application {

	public static void main(String[] args) {
		
		Dotenv dotenv = Dotenv.load();
		
		System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
	    System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
	    System.setProperty("TWILIO_ACCOUNT_SID", dotenv.get("TWILIO_ACCOUNT_SID"));
	    System.setProperty("TWILIO_AUTH_TOKEN", dotenv.get("TWILIO_AUTH_TOKEN"));
	    System.setProperty("TWILIO_PHONE_NUMBER", dotenv.get("TWILIO_PHONE_NUMBER"));
	    System.setProperty("EMAIL_USERNAME", dotenv.get("EMAIL_USERNAME"));
	    System.setProperty("EMAIL_PASSWORD", dotenv.get("EMAIL_PASSWORD"));
	    System.setProperty("RAZORPAY_KEY", dotenv.get("RAZORPAY_KEY"));
	    System.setProperty("RAZORPAY_SECRET", dotenv.get("RAZORPAY_SECRET"));
		
		SpringApplication.run(Application.class, args);
	}

	/*
	 * Configure ModelMapper as spring bean - so thar SC will manage it's life cycle
	 * + provide it as the depcy
	 */
	@Bean // method level annotation - to tell SC , following method
	// rets an object - which has to be managed as a spring bean
	// manages - life cycle +
	public ModelMapper modelMapper() {
		System.out.println("in model mapper creation");
		ModelMapper mapper = new ModelMapper();
		mapper.getConfiguration()
				/*
				 * To tell ModelMapper to map only those props whose names match in src n dest.
				 * objects
				 */
				.setSourceNameTokenizer(NameTokenizers.UNDERSCORE)
				.setDestinationNameTokenizer(NameTokenizers.CAMEL_CASE).setMatchingStrategy(MatchingStrategies.STRICT)
				/*
				 * To tell ModelMapper not to transfer nulls from src -> dest
				 */
				.setPropertyCondition(Conditions.isNotNull());// use case - PUT
		return mapper;

	}

	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}
	
}
