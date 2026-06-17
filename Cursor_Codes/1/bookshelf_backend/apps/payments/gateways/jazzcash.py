"""JazzCash gateway integration helpers (Pakistan).

Implements the HMAC-SHA256 secure-hash construction used by JazzCash. Without
configured credentials it returns a stubbed payload so the checkout flow can
be exercised end-to-end in development.
"""
from __future__ import annotations

import hashlib
import hmac
from datetime import datetime, timedelta
from decimal import Decimal

from django.conf import settings


def _secure_hash(params: dict, salt: str) -> str:
    """Compute the JazzCash secure hash from sorted, non-empty params."""
    sorted_values = [
        str(params[key]) for key in sorted(params) if params[key] != ""
    ]
    message = salt + "&" + "&".join(sorted_values)
    return hmac.new(
        salt.encode(), message.encode(), hashlib.sha256
    ).hexdigest()


def initiate_payment(order_number: str, amount: Decimal) -> dict:
    """Build the parameter set for a JazzCash hosted-checkout redirect."""
    merchant_id = settings.JAZZCASH_MERCHANT_ID
    password = settings.JAZZCASH_PASSWORD
    salt = settings.JAZZCASH_INTEGRITY_SALT

    now = datetime.now()
    txn_ref = f"T{now.strftime('%Y%m%d%H%M%S')}"
    amount_minor = str(int(Decimal(str(amount)) * 100))

    if not (merchant_id and password and salt):
        return {
            "stub": True,
            "txn_ref": txn_ref,
            "amount": amount_minor,
            "order_number": order_number,
            "message": (
                "JazzCash is not configured. Set JAZZCASH_* env vars to "
                "enable live payments."
            ),
        }

    params = {
        "pp_Version": "1.1",
        "pp_TxnType": "MWALLET",
        "pp_Language": "EN",
        "pp_MerchantID": merchant_id,
        "pp_Password": password,
        "pp_TxnRefNo": txn_ref,
        "pp_Amount": amount_minor,
        "pp_TxnCurrency": "PKR",
        "pp_TxnDateTime": now.strftime("%Y%m%d%H%M%S"),
        "pp_BillReference": order_number,
        "pp_Description": f"Bookshelf order {order_number}",
        "pp_TxnExpiryDateTime": (now + timedelta(hours=1)).strftime(
            "%Y%m%d%H%M%S"
        ),
        "pp_ReturnURL": settings.JAZZCASH_RETURN_URL,
        "ppmpf_1": "1",
    }
    params["pp_SecureHash"] = _secure_hash(params, salt)
    return {
        "stub": False,
        "txn_ref": txn_ref,
        "params": params,
        "post_url": (
            "https://sandbox.jazzcash.com.pk/CustomerPortal/"
            "transactionmanagement/merchantform/"
        ),
    }


def verify_callback(params: dict) -> bool:
    """Verify a JazzCash callback by recomputing the secure hash."""
    salt = settings.JAZZCASH_INTEGRITY_SALT
    if not salt:
        return False
    received = params.get("pp_SecureHash", "")
    to_check = {k: v for k, v in params.items() if k != "pp_SecureHash"}
    expected = _secure_hash(to_check, salt)
    return hmac.compare_digest(received, expected)
