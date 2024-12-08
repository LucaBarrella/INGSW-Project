package com.dieti.estates;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.logging.Logger;

@RestController
public class ServerController {

    Logger logger = Logger.getLogger(ServerController.class.getName());
    @PostMapping("/message")
    public String receiveMessage(@RequestBody String message) {
        if (logger.isLoggable(java.util.logging.Level.INFO)) {
            logger.info(String.format("Messaggio ricevuto: %s", message));
        }
        return "Messaggio ricevuto: " + message;
    }
}