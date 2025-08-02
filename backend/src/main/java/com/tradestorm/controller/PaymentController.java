package com.tradestorm.controller;

import com.cdac.model.User;
import com.tradestorm.service.UserService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import lombok.RequiredArgsConstructor;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

import static com.tradestorm.util.Utils.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final UserService userService;

    @Value("${razorpay.key}")
    private String razorpayKey;

    @Value("${razorpay.secret}")
    private String razorpaySecret;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestParam Long userId, @RequestParam int amountInRupees) {
        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKey, razorpaySecret);

            // Generate a receipt ID under 40 characters
            String receipt = "order_rcpt_" + UUID.randomUUID().toString().replace("-", "").substring(0, 20);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInRupees * 100); // in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", receipt);
            orderRequest.put("payment_capture", true);

            Order order = razorpay.orders.create(orderRequest);

            User user = userService.findEntityById(userId);
            user.setPaymentOrderId(order.get("id"));
            userService.save(user);

            return ResponseEntity.ok(order.toString());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating Razorpay order: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> data) {
        try {
            String orderId = data.get("orderId");
            String paymentId = data.get("paymentId");
            String signature = data.get("signature");
            Long userId = Long.parseLong(data.get("userId"));

            String payload = orderId + "|" + paymentId;
            String generatedSignature = calculateSignature(payload, razorpaySecret);

            if (!generatedSignature.equals(signature)) {
                return ResponseEntity.badRequest().body("Invalid payment signature");
            }

            int duration = data.containsKey("duration") ? Integer.parseInt(data.get("duration")) : 1;

            User user = userService.findEntityById(userId);
            user.setSubscribed(true);
            user.setSubscriptionStart(LocalDate.now());
            user.setSubscriptionEnd(LocalDate.now().plusMonths(duration));
            user.setPaymentOrderId(orderId);
            user.setPaymentId(paymentId);
            userService.save(user);

            return ResponseEntity.ok("Payment verified and subscription activated for " + duration + " month(s).");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Payment verification failed: " + e.getMessage());
        }
    }
}
