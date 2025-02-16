package com.server.auth;

import com.google.gson.JsonObject;
import com.server.dao.UserDao;
import com.server.mapper.ChangePasswordMapper;
import com.server.mapper.EmailMapper;
import com.server.model.User;
import com.server.utils.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Random;

@WebServlet({
        "/api/get-code",
        "/api/update-password"
})
public class ForgotPasswordService extends HttpServlet  {

    UserDao dao = new UserDao();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        resp.setContentType("application/json");
        try {
            if(req.getRequestURI().contains("/api/get-code")){
                EmailMapper mapper = HttpUtil.of(req.getReader()).toModel(EmailMapper.class);
                String code = generateCode();
                Mailer.send("mindan2152@gmail.com", mapper.getEmail(), "Your Code", "Your recovery code is: " + code);
                try {
                    String encryptCode = EncryptCode.encrypt(code);
                    JsonObject json = new JsonObject();
                    json.addProperty("code", encryptCode);
                    resp.getWriter().print(json);
                    resp.setStatus(200);
                } catch (Exception e) {
                    resp.setStatus(400);
                    throw new RuntimeException(e);
                }
            }else if(req.getRequestURI().contains("/api/update-password")) {
                ChangePasswordMapper mapper = HttpUtil.of(req.getReader()).toModel(ChangePasswordMapper.class);
                boolean check = dao.checkUser(mapper.getEmail()).isPresent();
                if(check){
                    User user = dao.checkUser(mapper.getEmail()).get();
                    user.setPassword(EncryptPasswordUtil.encryptPassword(mapper.getPassword()));
                    dao.update(user);
                    resp.setStatus(200);
                }
            }
        } catch (Exception e) {
            SendStatusUtil.sendStatusBad(resp);
            throw new RuntimeException(e);
        }

    }
    String generateCode() { return String.valueOf(100000 + new Random().nextInt(900000));}

}
