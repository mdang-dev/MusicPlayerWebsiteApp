package com.server.auth;

import com.google.gson.JsonObject;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.JWTClaimsSet;
import com.server.dao.UserDao;
import com.server.model.User;
import com.server.utils.JwtUtil;
import com.server.utils.SendStatusUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@WebServlet({
        "/api/refresh"
})
public class RefreshToken extends HttpServlet {

    UserDao dao = new UserDao();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {


     String refreshToken = Arrays.stream(req.getCookies())
                  .filter(cookie -> "refreshToken"
                          .equals(cookie.getName()))
                  .map(Cookie::getValue)
                  .findFirst()
                  .orElse(null);
        System.out.println(refreshToken);
        try {
            JWTClaimsSet claims = JwtUtil.validToken(refreshToken);
            if(claims == null) resp.setStatus(400);
            String email = claims.getSubject();
            if(dao.checkUser(email).isPresent()){
                User user = dao.checkUser(email).get();
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("userId", user.getUserId());
                userInfo.put("userName", user.getUserName());
                userInfo.put("name", user.getName());
                userInfo.put("email", user.getEmail());
                userInfo.put("avatar", user.getAvatar());
                userInfo.put("role", user.isRole());
                String newAccessToken = JwtUtil.generateAccessToken(email, userInfo);
                JsonObject jsonObject = new JsonObject();
                jsonObject.addProperty("accessToken", newAccessToken);
                resp.getWriter().print(jsonObject);
                resp.setStatus(200);
            }

        } catch (ParseException | JOSEException e) {
            SendStatusUtil.sendStatusBad(resp);
            throw new RuntimeException(e);
        }
    }
}
