# powerball lottery number generator

import random

def main():
    # generate random numbers
    for i in range(5):
        print(random.randint(1, 69), end=' ')
    print(random.randint(1, 26))

main()
