package com.server.utils;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.BufferedReader;

public class HttpUtil {

    String value;

    public HttpUtil(String value) {
        this.value = value;
    }

    public <T> T toModel (Class<T> tClass)  {
        try{
            return new ObjectMapper().readValue(value, tClass);
        }catch (Exception e){
            System.out.println(e.getMessage());
        }
        return null;
    }

    public static HttpUtil of (BufferedReader reader){
        StringBuilder builder = new StringBuilder();
        String line;
        try{
            while ((line = reader.readLine()) != null){
                builder.append(line);
            }
        }catch (Exception e){
            System.out.println(e.getMessage());
        }
        return new HttpUtil(builder.toString());
    }

}
