package com.server.utils;


import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

public class Mailer {

    public static void send(String from, String to, String subject, String body) {

        Properties props = new Properties();
        props.setProperty("mail.smtp.auth", "true");
        props.setProperty("mail.smtp.starttls.enable", "true");
        props.setProperty("mail.smtp.host", "smtp.gmail.com");
        props.setProperty("mail.smtp.port", "587");
        props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        props.put("mail.smtp.ssl.protocols", "TLSv1.2");

        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                String username = "mindan2152@gmail.com";
                String password = "zchf jfkq tiox bvht";
                return new PasswordAuthentication(username, password);
            }
        });
        try {
            MimeMessage mail = new MimeMessage(session);
            mail.setFrom(new InternetAddress(from));
            mail.setRecipients(Message.RecipientType.TO, to);
            mail.setSubject(subject, "utf-8");
            mail.setText(body, "utf-8", "html");
            mail.setReplyTo(mail.getFrom());

            Transport.send(mail);

        } catch (Exception e) {
            e.printStackTrace();
        }

    }



}
