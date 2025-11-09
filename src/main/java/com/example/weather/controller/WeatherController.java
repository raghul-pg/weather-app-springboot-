package com.example.weather.controller;

import com.example.weather.model.WeatherResponse;
import com.example.weather.service.WeatherService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@Controller
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/")
    public String home() {
        return "index";
    }

    // JSON endpoint used by client-side JS
    @GetMapping("/api/weather")
    public ResponseEntity<?> getWeatherApi(@RequestParam String city) {
        try {
            WeatherResponse weather = weatherService.getWeatherData(city);
            if (weather == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "City not found"));
            }
            return ResponseEntity.ok(weather);
        } catch (org.springframework.web.client.HttpClientErrorException.NotFound e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "City not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Could not fetch weather"));
        }
    }
}