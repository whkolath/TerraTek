# Abstract
Rainwater harvesting (RWH) presents a sustainable and practical approach to water conservation, particularly in rural and semi-arid regions. However, effective management of RWH systems requires continuous monitoring of environmental conditions and water quality parameters. This paper presents TerraTek, an end-to-end Internet of Things (IoT) solution designed to monitor water levels, pH, conductivity, temperature, wind speed and direction, rainfall, and ambient conditions in a distributed RWH system. The system leverages LoRaWAN for long-range, low-power data transmission and features a locally hosted private network server built using ChirpStack, eliminating reliance on third-party cloud services without a subscription. Data is collected from modular sensor nodes powered by solar energy, transmitted to a Raspberry Pi gateway, and stored in a MySQL database for visualization on a public dashboard built with Next.js. This paper outlines the system architecture, component selection, hardware design, and software integration, offering a scalable, effective, research orientated model for rural smart water systems and environmental monitoring.

# INTRODUCTION
Access to clean, reliable freshwater is a growing global concern, particularly in rural and semi-arid regions where groundwater reserves are depleting and rainfall is unpredictable. While rainwater harvesting (RWH) provides an effective means of supplementing local water supply, most RWH systems lack the infrastructure necessary for continuous monitoring and data-driven management. Traditional monitoring techniques are manual, time-consuming, and inadequate for capturing trends necessary for sustainable water use.

To address these challenges, there is a pressing need for efficient, autonomous systems that can monitor environmental and water quality parameters in real time while operating in remote areas with minimal maintenance. This paper presents TerraTek, a comprehensive full-stack Internet of Things (IoT) platform specifically designed for this purpose. TerraTek is engineered to be solar-powered, eliminating the need for traditional power infrastructure, and uses LoRaWAN for long-range, low-power wireless communication—ideal for wide-area rural deployments.

What sets TerraTek apart is its private infrastructure. The system operates entirely off the cloud using a locally hosted LoRaWAN network server built with ChirpStack, providing complete data sovereignty and avoiding recurring subscription fees. Sensor data collected from distributed nodes is transmitted to a Raspberry Pi gateway, processed, and stored on a self-hosted MySQL server, and visualized on a public-facing Next.js dashboard. This architecture ensures high reliability, data privacy, and offline capability.

This paper explores the motivations behind the project, outlines the technical implementation, and demonstrates how TerraTek serves as a sustainable and scalable solution for environmental monitoring in underserved areas.

# Project Overveiw
![image](https://github.com/user-attachments/assets/73d3561d-ec0c-4575-b183-4faa7d0aacdc)

# Project Implementation
The working version of this system can be accessed at https://terratekrwh.com


![Playa Station Overhead](https://github.com/user-attachments/assets/99ce5a54-cdc4-43e1-9724-b84e52bf101a)
![DJI_20250429174744_0114_D](https://github.com/user-attachments/assets/a1a211d4-a258-4081-b601-5aad36bab02b)
![IMG_2902](https://github.com/user-attachments/assets/5e0f9663-f77b-46b0-81f0-4a6bc3833cf6)
![IMG_2896](https://github.com/user-attachments/assets/00464024-3dc4-47c2-ade3-8c7880fef031)

