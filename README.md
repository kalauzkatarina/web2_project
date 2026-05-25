# TravelPlanning - Microservices System

A robust, scalable travel planning platform built using **Azure Service Fabric** microservices architecture. This system is designed to handle distributed workloads, ensuring high availability and modularity for managing travel itineraries, users, and finances.

## System Architecture

The project leverages the **Microservices** architectural style, where each service is decoupled and manages its own state and data.

<img width="1491" height="890" alt="Arhitektura sistema" src="https://github.com/user-attachments/assets/384d8e1a-1d13-4d48-a857-037ed557b260" />

### Architectural Components:
* **API Gateway (Web_Api):** A stateless service that acts as the entry point for all client requests, handling routing and communication with backend services.
* **UserService:** Manages user authentication, registration, and profile management.
* **TravelPlanService:** (Planned) Handles the core logic of creating and managing itineraries.
* **FinanceService:** (Planned) Manages budget tracking and expense reports.
* **Service Remoting:** Utilizes Microsoft Service Fabric Remoting for high-performance communication between services.

---

## Use Case Analysis

The following diagram illustrates the primary actors and their interactions within the system, showcasing the core business logic.

<img width="631" height="981" alt="Use case" src="https://github.com/user-attachments/assets/903150ef-065d-4c4a-868a-059451c8d497" />

### Key Functionalities:
1.  **Identity Management:** Secure registration and login processes.
2.  **Itinerary Management:** Users can plan trips, add locations, and organize schedules.
3.  **Financial Tracking:** Integrated expense management for every travel plan.

---

## How to Run

1.  **Prerequisites:**
    * Visual Studio 2022 with Service Fabric SDK.
    * Local Service Fabric Cluster (5-node) running.
2.  **Database Setup:** Update the connection strings in `PackageRoot/Config/Settings.xml` for each service.
3.  **Deploy:** Press `F5` in Visual Studio to deploy and run the application on your local cluster.
4.  **Access:** Once deployed, the API Gateway is accessible via `http://localhost:9062/swagger`.

---

## Design Note
The architecture and diagrams were designed with a focus on both technical accuracy and visual clarity, bridging the gap between engineering and user-centric design.
