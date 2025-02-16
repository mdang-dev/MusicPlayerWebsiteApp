package com.server.auth;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.JWTClaimsSet;
import com.server.utils.JwtUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;

@WebServlet({
        "/api/protected"
})
public class ProtectedService extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String authorizationHeader = req.getHeader("Authorization");
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        if(authorizationHeader != null && authorizationHeader.startsWith("Bearer")) {
            String token = authorizationHeader.substring(7);
            try {
                JWTClaimsSet claims = JwtUtil.validToken(token);
                if(claims != null) {
                    JsonObject userInfo = new JsonObject();
                    userInfo.add("userInfo", new Gson()
                                .toJsonTree(claims.getClaim("userInfo")));
                    resp.getWriter().print(userInfo);
                    resp.setStatus(200);
                }else
                    resp.setStatus(401);
            } catch (ParseException | JOSEException e) {
                throw new RuntimeException(e);
            }
        }
    }

}
