#include <iostream>

int main() {
    char op;
    double num1, num2;

    std::cin >> op >> num1 >> num2;

    switch(op) {
        case '+':
            std::cout << num1 + num2;
            break;
        case '-':
            std::cout << num1 - num2;
            break;
        case '*':
            std::cout << num1 * num2;
            break;
        case '/':
            if (num2 != 0)
                std::cout << num1 / num2;
            else
                std::cout << "Error!";
            break;
        default:
            std::cout << "Error!";
    }
    return 0;
}
