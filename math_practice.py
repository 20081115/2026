import random
import operator

PROBLEMS = [
    ("+", operator.add),
    ("-", operator.sub),
    ("*", operator.mul),
    ("/", operator.truediv),
]

LEVELS = {
    "1": (1, 10),
    "2": (1, 50),
    "3": (1, 100),
    "4": (1, 500),
}


def choose_level():
    print("請選擇練習等級：")
    for key, rng in LEVELS.items():
        print(f"  {key}. 數字範圍 {rng[0]}~{rng[1]}")

    while True:
        choice = input("輸入等級 (1-4)：").strip()
        if choice in LEVELS:
            return LEVELS[choice]
        print("請輸入 1、2、3 或 4。")


def choose_mode():
    print("\n請選擇題型：")
    print("  1. 加減法")
    print("  2. 乘除法")
    print("  3. 混合題型")

    while True:
        choice = input("輸入題型 (1-3)：").strip()
        if choice in ["1", "2", "3"]:
            return choice
        print("請輸入 1、2 或 3。")


def generate_problem(level_range, mode):
    a = random.randint(*level_range)
    b = random.randint(*level_range)

    if mode == "1":
        ops = PROBLEMS[:2]
    elif mode == "2":
        ops = PROBLEMS[2:]
    else:
        ops = PROBLEMS

    symbol, fn = random.choice(ops)

    if symbol == "/":
        b = random.randint(1, level_range[1])
        a = b * random.randint(level_range[0], level_range[1] // max(1, b))

    return a, b, symbol, fn


def ask_question(a, b, symbol, fn):
    question = f"{a} {symbol} {b} = "
    while True:
        answer = input(question).strip()
        try:
            if symbol == "/":
                expected = fn(a, b)
                if abs(float(answer) - expected) < 1e-6:
                    return True
            else:
                if int(answer) == fn(a, b):
                    return True
        except ValueError:
            pass
        print("答案不正確，再試一次。")


def main():
    print("歡迎使用數學練習程式！")
    level_range = choose_level()
    mode = choose_mode()
    score = 0
    rounds = 0

    while True:
        a, b, symbol, fn = generate_problem(level_range, mode)
        if ask_question(a, b, symbol, fn):
            score += 1
            print("答對了！\n")
        rounds += 1

        cont = input("是否繼續練習？(y/n)：").strip().lower()
        if cont != "y":
            break

    print(f"\n練習結束。你總共答對 {score} 題，出題 {rounds} 題。")


if __name__ == "__main__":
    main()
