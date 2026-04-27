package com.cms.customer.controller;

import com.cms.customer.dto.CustomerDTO;
import com.cms.customer.service.CustomerService;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerController {

    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    @PostMapping("/upload")
    public String upload(@RequestParam("file") MultipartFile file) {
        service.uploadExcel(file);
        return "Upload successful!";
    }
    @PostMapping
    public CustomerDTO create(@RequestBody CustomerDTO dto) {
        return service.createCustomer(dto);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.deleteCustomer(id);
        return "Customer deleted successfully!";
    }
    @PutMapping("/{id}")
    public CustomerDTO update(@PathVariable Long id, @RequestBody CustomerDTO dto) {
        return service.updateCustomer(id, dto);
    }


    @GetMapping("/{id}")
    public CustomerDTO get(@PathVariable Long id) {
        return service.getCustomer(id);
    }


    @GetMapping
    public List<CustomerDTO> getAll() {
        return service.getAllCustomers();
    }
}