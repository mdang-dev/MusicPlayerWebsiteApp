package com.server.auth;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet({
        "/api/login"
})
public class LoginService extends HttpServlet  {

    private final String SECRET_KEY = "751efc1a75a700f4ffe3fec4dbb4d1ba12a1cb9a7f914ec934088984dc2c20be";

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String userName = "user123";
        String password = "12345";

    }
}
