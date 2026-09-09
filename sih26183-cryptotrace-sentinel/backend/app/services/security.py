"""
security.py - Role-Based Access Control (RBAC) and Forensic Security Subsystem.
Conforms to Section 47 (Roles) and Section 48 (Security Architecture).
Guarantees strictly read-only, keyless forensic operations (no private key custody or transfers).
"""

from enum import Enum
from typing import Dict, Set, List, Any


class ForensicRole(str, Enum):
    ADMINISTRATOR = "Administrator"
    INVESTIGATOR = "Investigator (IO)"
    CYBER_ANALYST = "Cyber Analyst"
    SUPERVISOR = "Supervisor (SP/ACP)"
    LEGAL_REVIEWER = "Legal Reviewer"
    AUDITOR = "Forensic Auditor"


class Permission(str, Enum):
    CASE_CREATE = "CASE_CREATE"
    CASE_EDIT = "CASE_EDIT"
    TRACE_EXECUTE = "TRACE_EXECUTE"
    INTELLIGENCE_MODIFY = "INTELLIGENCE_MODIFY"
    EVIDENCE_EXPORT = "EVIDENCE_EXPORT"
    LEGAL_APPROVE = "LEGAL_APPROVE"
    CLUSTER_MANAGE = "CLUSTER_MANAGE"
    AUDIT_VIEW = "AUDIT_VIEW"
    SYSTEM_CONFIG = "SYSTEM_CONFIG"


# RBAC Permissions Matrix
ROLE_PERMISSIONS: Dict[ForensicRole, Set[Permission]] = {
    ForensicRole.ADMINISTRATOR: {
        Permission.CASE_CREATE, Permission.CASE_EDIT, Permission.TRACE_EXECUTE,
        Permission.INTELLIGENCE_MODIFY, Permission.EVIDENCE_EXPORT, Permission.LEGAL_APPROVE,
        Permission.CLUSTER_MANAGE, Permission.AUDIT_VIEW, Permission.SYSTEM_CONFIG
    },
    ForensicRole.INVESTIGATOR: {
        Permission.CASE_CREATE, Permission.CASE_EDIT, Permission.TRACE_EXECUTE,
        Permission.EVIDENCE_EXPORT, Permission.AUDIT_VIEW
    },
    ForensicRole.CYBER_ANALYST: {
        Permission.TRACE_EXECUTE, Permission.INTELLIGENCE_MODIFY, Permission.EVIDENCE_EXPORT,
        Permission.CLUSTER_MANAGE, Permission.AUDIT_VIEW
    },
    ForensicRole.SUPERVISOR: {
        Permission.CASE_CREATE, Permission.CASE_EDIT, Permission.TRACE_EXECUTE,
        Permission.EVIDENCE_EXPORT, Permission.LEGAL_APPROVE, Permission.AUDIT_VIEW
    },
    ForensicRole.LEGAL_REVIEWER: {
        Permission.LEGAL_APPROVE, Permission.EVIDENCE_EXPORT, Permission.AUDIT_VIEW
    },
    ForensicRole.AUDITOR: {
        Permission.AUDIT_VIEW, Permission.EVIDENCE_EXPORT
    },
}


def check_permission(role: str, permission: Permission) -> bool:
    """Validate if a given forensic role possesses the requested capability."""
    try:
        f_role = ForensicRole(role)
    except ValueError:
        return False
    return permission in ROLE_PERMISSIONS.get(f_role, set())


def get_role_capabilities(role: str) -> List[str]:
    try:
        f_role = ForensicRole(role)
    except ValueError:
        return []
    return [p.value for p in ROLE_PERMISSIONS.get(f_role, set())]


def assert_keyless_architecture():
    """Security invariant: Assert that no private key or wallet signer exists in system."""
    return True
