package com.emailassistant.email_writer_rn;

import lombok.Data;

@Data
public class EmailRequest {
    private String emailContent;
    private String tone;
}
