using System.Runtime.Serialization;

namespace Core.Entities.OrderAggregate
{
    public enum OrderStatus
    {
        [EnumMember(Value = "Pending")]
        Pending,
        [EnumMember(Value = "Payment Receive")]
        PaymentReceive,
        [EnumMember(Value = "Payment Failed")]
        PaymentFailed,
        
        [EnumMember(Value = "Shipped Complete")]
        ShippedComplete,
        
        [EnumMember(Value = "Shipped Not Completed")]
        ShippedNotCompleted
        
    }
}
