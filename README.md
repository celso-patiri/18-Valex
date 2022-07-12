<div align="center">

  <img src="https://dm0qx8t0i9gc9.cloudfront.net/thumbnails/video/uh59Wh0/videoblocks-credit-card-line-drawing-animation-transparent-vector-motion-graphics-loop-line-drawing-animation-transparent-vector-motion-graphics-loop_riccca7cq_thumbnail-1080_05.png" alt="Logo" width="200">
  
  <h3 align="center">
     Mock benefit card management API
  </h3>
    <br />
  
  <div align="center">

   ![Node.js ](https://img.shields.io/badge/node.js-6DA55F?logo=node.js&logoColor=white&style=for-the-badge)
   ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB&style=for-the-badge)
   ![Postgres](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

  </div>
  
</div>

## What I Learned
  
  - More about backend architecture and design
  - Express.js error handling and logging layers 
  - [Zod](https://github.com/colinhacks/zod) schema validation and type inference
  - Better TypeScript typing of Express entities
  - TS utilities like `Omit` and `Partial` 

## Routes

  - [X] **POST** `/cards`
    - headers: `x-api-key`
    - body: 
    ```TypeScript
      empoyeeId: number,
      type: enum
    ```
  - [X] **POST** `/cards/:id/activate`
    - body: 
    ```TypeScript
      cvc: string,
      password: string
    ```
  - [X] **POST** `/cards/:id/recharge`
    - headers: `x-api-key`
    - body: 
    ```TypeScript
      amount: number
    ```
    
  - [X] **POST** `/cards/:id/block`
    - body: 
    ```TypeScript
      password: string
    ```
  - [X] **POST** `/cards/:id/unblock`
    - body: 
    ```TypeScript
      password: string
    ```
  - [X] **POST** `/cards/virtual`
    - body: 
    ```TypeScript
      id: number,
      password: string
    ```
  - [X] **GET** `/cards/:id/balance`
  - [X] **DELETE** `/cards/:id`
    - body: 
    ```TypeScript
      id: number,
      password: string
    ```

  - [X] **POST** `/purchase`
    - body: 
    ```TypeScript
      cardId: number
      password: string
      businessId: number
      amount: number
    ```
  - [X] **POST** `/purchase/online`
    - body: 
    ```TypeScript
      cardId: number
      number: string
      name: string
      expirationDate: string
      securityCode: string
      businessId: number
      amount: number
    ```
  
  

