package com.server.utils;

import com.google.gson.Gson;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class SendStatusUtil {

    static class Message {
        String message;
        public Message(){}
        public Message(String message){
            this.message = message;
        }
    }

    public static void sendStatusOk(HttpServletResponse resp) throws IOException {
        resp.setStatus(HttpServletResponse.SC_OK);
        resp.getWriter().write("{\"message\": \"Successfully !\"}");

    }

    public static void sendStatusBad(HttpServletResponse resp) throws IOException {
        resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        resp.getWriter().write("{\"message\": \"Failed to save song\"}");
    }

    public static void sendMessageBad(HttpServletResponse resp, String newMessage) throws IOException {
        resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        Message message = new Message(newMessage);
        resp.getWriter().write(new Gson().toJson(message));
    }

    public static void sendStatusMess(HttpServletResponse resp, String message, int code) throws IOException {
        resp.setStatus(code);
        resp.getWriter().print(new Gson().toJson(new Message(message)));
    }

}
