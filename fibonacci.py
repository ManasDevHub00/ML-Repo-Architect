def fibonacci(n):
    """
    Calculates the nth Fibonacci number.
    Time Complexity: O(2^n)
    Space Complexity: O(n) due to recursion stack.
    """
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
