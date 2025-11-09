package com.example.weather.model;

import lombok.Data;

@Data
public class WeatherResponse {
    private WeatherMain main;
    private Weather[] weather;
    private Wind wind;
    private String name;
}

@Data
class WeatherMain {
    private double temp;
    private double feels_like;
    private double temp_min;
    private double temp_max;
    private int humidity;
    private int pressure;
}

@Data
class Weather {
    private String main;
    private String description;
    private String icon;
}

@Data
class Wind {
    private double speed;
    private int deg;
}