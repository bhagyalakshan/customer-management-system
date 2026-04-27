package com.cms.customer.service;

import com.cms.customer.dto.CustomerDTO;

import java.util.List;

public interface CustomerService {

    CustomerDTO createCustomer(CustomerDTO dto);

    CustomerDTO updateCustomer(Long id, CustomerDTO dto);

    CustomerDTO getCustomer(Long id);

    List<CustomerDTO> getAllCustomers();
    void deleteCustomer(Long id);
    void uploadExcel(org.springframework.web.multipart.MultipartFile file);
}