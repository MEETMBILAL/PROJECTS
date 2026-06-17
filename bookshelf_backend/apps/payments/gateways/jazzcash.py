"""JazzCash gateway integration (stub-ready)."""
from __future__ import annotations

import hashlib
import hmac
from datetime import datetime, timedelta
from decimal import Decimal

from django.conf import settings


class JazzCashGateway:
    """Builds JazzCash HTTP POST request parameters and verifies callbacks.

    Implements the standard JazzCash "Mobile Account / Card" hosted-checkout
    integrity-hash flow. Works with sandbox credentials; falls back to a stub
    when credentials are not configured.
    """

    POST_URL = "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform"

    def __init__(self):
        self.merchant_id = settings.JAZZCASH_MERCHANT_ID
        self.password = settings.JAZZCASH_PASSWORD
        self.salt = settings.JAZZCASH_INTEGRITY_SALT
        self.return_url = settings.JAZZCASH_RETURN_URL
        self.enabled = bool(self.merchant_id and self.password and self.salt)

    def _secure_hash(self, params: dict) -> str:
        sorted_values = [str(params[k]) for k in sorted(params) if params[k] != ""]
        message = self.salt + "&" + "&".join(sorted_values)
        return hmac.new(
            self.salt.encode(), message.encode(), hashlib.sha256
        ).hexdigest().upper()

    def initiate(self, order, amount: Decimal):
        now = datetime.now()
        expiry = now + timedelta(hours=1)
        amount_minor = str(int(Decimal(amount) * 100))
        params = {
            "pp_Version": "1.1",
            "pp_TxnType": "MWALLET",
            "pp_Language": "EN",
            "pp_MerchantID": self.merchant_id or "STUB_MERCHANT",
            "pp_Password": self.password or "STUB_PASSWORD",
            "pp_TxnRefNo": f"T{now.strftime('%Y%m%d%H%M%S')}{order.id}",
            "pp_Amount": amount_minor,
            "pp_TxnCurrency": "PKR",
            "pp_TxnDateTime": now.strftime("%Y%m%d%H%M%S"),
            "pp_TxnExpiryDateTime": expiry.strftime("%Y%m%d%H%M%S"),
            "pp_BillReference": order.order_number,
            "pp_Description": f"Bookshelf.pk order {order.order_number}",
            "pp_ReturnURL": self.return_url,
        }
        if self.enabled:
            params["pp_SecureHash"] = self._secure_hash(params)
        else:
            params["pp_SecureHash"] = "STUB_HASH"
            params["stub"] = True
        return {"post_url": self.POST_URL, "params": params}

    def verify_callback(self, data: dict) -> bool:
        if not self.enabled:
            return True
        received_hash = data.get("pp_SecureHash", "")
        params = {k: v for k, v in data.items() if k != "pp_SecureHash"}
        expected = self._secure_hash(params)
        return hmac.compare_digest(received_hash.upper(), expected)
