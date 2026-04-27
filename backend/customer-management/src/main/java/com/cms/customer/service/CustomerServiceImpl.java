package com.cms.customer.service.impl;

import com.cms.customer.dto.CustomerDTO;
import com.cms.customer.entity.Customer;
import com.cms.customer.repository.CustomerRepository;
import com.cms.customer.service.CustomerService;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository repository;

    public CustomerServiceImpl(CustomerRepository repository) {
        this.repository = repository;
    }
    @Override
    public void deleteCustomer(Long id) {
        Customer customer = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        repository.delete(customer);
    }

    @Override
    public CustomerDTO createCustomer(CustomerDTO dto) {

        repository.findByNic(dto.getNic()).ifPresent(c -> {
            throw new RuntimeException("NIC already exists");
        });

        Customer customer = mapToEntity(dto);
        Customer saved = repository.save(customer);

        return mapToDTO(saved);
    }


    @Override
    public CustomerDTO updateCustomer(Long id, CustomerDTO dto) {

        Customer customer = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        customer.setName(dto.getName());
        customer.setDob(dto.getDob());
        customer.setNic(dto.getNic());
        customer.setMobileNumbers(dto.getMobileNumbers());
        customer.setAddresses(dto.getAddresses());

        return mapToDTO(repository.save(customer));
    }


    @Override
    public CustomerDTO getCustomer(Long id) {
        return repository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }


    @Override
    public List<CustomerDTO> getAllCustomers() {
        return repository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }


    private Customer mapToEntity(CustomerDTO dto) {

        Customer c = new Customer();
        c.setId(dto.getId());
        c.setName(dto.getName());
        c.setDob(dto.getDob());
        c.setNic(dto.getNic());
        c.setMobileNumbers(dto.getMobileNumbers());
        c.setAddresses(dto.getAddresses());

        if (dto.getFamilyMemberIds() != null) {
            List<Customer> family = repository.findAllById(dto.getFamilyMemberIds());
            c.setFamilyMembers(family);
        }

        return c;
    }
    @Override
    public void uploadExcel(org.springframework.web.multipart.MultipartFile file) {

        try {
            org.apache.poi.ss.usermodel.Workbook workbook =
                    org.apache.poi.ss.usermodel.WorkbookFactory.create(file.getInputStream());

            org.apache.poi.ss.usermodel.Sheet sheet = workbook.getSheetAt(0);

            java.util.List<Customer> batch = new java.util.ArrayList<>();
            int batchSize = 100;

            for (org.apache.poi.ss.usermodel.Row row : sheet) {


                if (row.getRowNum() == 0) continue;

                Customer c = new Customer();


                if (row.getCell(0) != null) {
                    c.setName(row.getCell(0).toString().trim());
                }


                if (row.getCell(1) != null &&
                        row.getCell(1).getCellType() == org.apache.poi.ss.usermodel.CellType.NUMERIC) {

                    c.setDob(row.getCell(1)
                            .getLocalDateTimeCellValue()
                            .toLocalDate());
                }


                if (row.getCell(2) != null) {
                    c.setNic(row.getCell(2).toString().trim());
                }


                if (c.getName() == null || c.getDob() == null || c.getNic() == null) {
                    continue;
                }


                if (repository.findByNic(c.getNic()).isPresent()) {
                    continue;
                }

                batch.add(c);


                if (batch.size() == batchSize) {
                    repository.saveAll(batch);
                    batch.clear();
                }
            }


            if (!batch.isEmpty()) {
                repository.saveAll(batch);
            }

            workbook.close();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Excel upload failed: " + e.getMessage());
        }
    }

    private CustomerDTO mapToDTO(Customer c) {

        CustomerDTO dto = new CustomerDTO();

        dto.setId(c.getId());
        dto.setName(c.getName());
        dto.setDob(c.getDob());
        dto.setNic(c.getNic());
        dto.setMobileNumbers(c.getMobileNumbers());
        dto.setAddresses(c.getAddresses());

        if (c.getFamilyMembers() != null) {
            dto.setFamilyMemberIds(
                    c.getFamilyMembers()
                            .stream()
                            .map(Customer::getId)
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }
}