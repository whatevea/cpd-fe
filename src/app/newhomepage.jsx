< !DOCTYPE html >
    <html class="dark" lang="en"><head>
        <meta charset="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>Chess Puzzles</title>
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&amp;display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
        <script id="tailwind-config">
            tailwind.config = {
                darkMode: "class",
            theme: {
                extend: {
                colors: {
                "primary": "#135bec",
            "background-light": "#f6f6f8",
            "background-dark": "#101622",
            "surface": "#1c1f27",
            "border": "#282e39"
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
            borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
          },
        },
      }
        </script>
        <style>
            .material-symbols-outlined {
                font - variation - settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            font-size: 20px;
        }
        </style>
    </head>
        <body class="bg-background-dark font-display">
            <div class="flex flex-col h-screen">
                <header class="flex-shrink-0 flex items-center justify-between whitespace-nowrap border-b border-solid border-border px-10 py-3">
                    <div class="flex items-center gap-8">
                        <div class="flex items-center gap-4 text-white">
                            <div class="size-6 text-primary">
                                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
                                </svg>
                            </div>
                            <h2 class="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Chess Puzzles</h2>
                        </div>
                        <nav class="flex items-center gap-9">
                            <a class="text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Puzzles</a>
                            <a class="text-gray-400 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Leaderboard</a>
                            <a class="text-gray-400 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Learn</a>
                            <a class="text-gray-400 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Community</a>
                        </nav>
                    </div>
                    <div class="flex flex-1 justify-end items-center gap-4">
                        <div class="flex items-center gap-2">
                            <button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]">
                                <span class="truncate">Sign Up</span>
                            </button>
                            <button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-surface text-white text-sm font-bold leading-normal tracking-[0.015em]">
                                <span class="truncate">Log In</span>
                            </button>
                        </div>
                        <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" data-alt="User avatar placeholder" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAtPGf_g0f0qL-Mf8f0hDQ46qlBduyN6bblX1FqhRlNFeOGUFT09K5xNKRebpqcA8gWa2YgTO98A2M-86SgXp5TVDK62gq4a5m5odDnDD6ba1gkVVniCliAC8kDZImUVUYxAprDrMht5vo4fPvE_-liDHQQcK1vTnYfYZ_gxkpT51QGF7APibYUZB4d88tinBy5dS5wcgR0TiH2w9t1h0qznWlw9EmpzNVNKbAOkw4KCv6dskwFrbKiaHTbfJaAV6u3TWNl_AUffF4");'></div>
                    </div>
                </header>
                <main class="flex-grow flex overflow-hidden">
                    <div class="w-7/12 flex flex-col p-8 overflow-y-auto">
                        <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
                            <h1 class="text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">Puzzle Library</h1>
                            <div class="flex items-center gap-4">
                                <label class="flex flex-col min-w-40 !h-10 max-w-64">
                                    <div class="flex w-full flex-1 items-stretch rounded-lg h-full">
                                        <div class="text-[#9da6b9] flex border-none bg-surface items-center justify-center pl-4 rounded-l-lg border-r-0">
                                            <span class="material-symbols-outlined">search</span>
                                        </div>
                                        <input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-surface focus:border-none h-full placeholder:text-[#9da6b9] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" placeholder="Search puzzles" value="" />
                                    </div>
                                </label>

                            </div>
                        </div>
                        <div class="pb-3 border-b border-border">
                            <div class="flex gap-8">

                                <a class="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-gray-400 pb-[13px] pt-4" href="#">
                                    <p class="text-gray-400 text-sm font-bold leading-normal tracking-[0.015em]">All</p>
                                </a>
                                <a class="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-gray-400 pb-[13px] pt-4" href="#">
                                    <p class="text-gray-400 text-sm font-bold leading-normal tracking-[0.015em]">Standard</p>
                                </a>
                                <a class="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-gray-400 pb-[13px] pt-4" href="#">
                                    <p class="text-gray-400 text-sm font-bold leading-normal tracking-[0.015em]">Atypical</p>
                                </a>

                            </div>
                        </div>
                        <div class="flex-grow mt-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div class="bg-surface rounded-lg p-5 flex flex-col justify-between hover:ring-2 hover:ring-primary cursor-pointer transition-all">
                                    <div>
                                        <div class="flex items-center justify-between mb-2">
                                            <h3 class="text-white font-bold text-lg">Queen Sacrifice</h3>
                                            <span class="material-symbols-outlined text-gray-400" style="font-size: 28px;">grid_view</span>
                                        </div>
                                        <div class="flex items-center gap-2 text-gray-400 text-sm mb-4">
                                            <span class="material-symbols-outlined text-base">sell</span>
                                            {/* no need these tags  */}
                                            <span class="bg-gray-700 text-gray-300 text-xs font-medium px-2 py-0.5 rounded">Sacrifice</span>
                                            <span class="bg-gray-700 text-gray-300 text-xs font-medium px-2 py-0.5 rounded">Tactic</span>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2 text-green-400 text-sm font-medium mt-2">
                                        <div class="size-2 bg-green-400 rounded-full"></div>
                                        <span>150 players currently solving</span>
                                    </div>
                                </div>
                                <div class="bg-surface rounded-lg p-5 flex flex-col justify-between hover:ring-2 hover:ring-primary cursor-pointer transition-all">
                                    <div>
                                        <div class="flex items-center justify-between mb-2">
                                            <h3 class="text-white font-bold text-lg">The Knight's Endgame</h3>
                                            <span class="material-symbols-outlined text-gray-400" style="font-size: 28px;">grid_view</span>
                                        </div>
                                        <div class="flex items-center gap-2 text-gray-400 text-sm mb-4">
                                            <span class="material-symbols-outlined text-base">sell</span>
                                            <span class="bg-gray-700 text-gray-300 text-xs font-medium px-2 py-0.5 rounded">Endgame</span>
                                            <span class="bg-gray-700 text-gray-300 text-xs font-medium px-2 py-0.5 rounded">Knight</span>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2 text-green-400 text-sm font-medium mt-2">
                                        <div class="size-2 bg-green-400 rounded-full"></div>
                                        <span>98 players currently solving</span>
                                    </div>
                                </div>
                                <div class="bg-surface rounded-lg p-5 flex flex-col justify-between hover:ring-2 hover:ring-primary cursor-pointer transition-all">
                                    <div>
                                        <div class="flex items-center justify-between mb-2">
                                            <h3 class="text-white font-bold text-lg">An Unexpected Fork</h3>
                                            <span class="material-symbols-outlined text-gray-400" style="font-size: 28px;">grid_view</span>
                                        </div>
                                        <div class="flex items-center gap-2 text-gray-400 text-sm mb-4">
                                            <span class="material-symbols-outlined text-base">sell</span>
                                            <span class="bg-gray-700 text-gray-300 text-xs font-medium px-2 py-0.5 rounded">Fork</span>
                                            <span class="bg-gray-700 text-gray-300 text-xs font-medium px-2 py-0.5 rounded">Beginner</span>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2 text-green-400 text-sm font-medium mt-2">
                                        <div class="size-2 bg-green-400 rounded-full"></div>
                                        <span>210 players currently solving</span>
                                    </div>
                                </div>
                                <div class="bg-surface rounded-lg p-5 flex flex-col justify-between hover:ring-2 hover:ring-primary cursor-pointer transition-all">
                                    <div>
                                        <div class="flex items-center justify-between mb-2">
                                            <h3 class="text-white font-bold text-lg">Pin and Win</h3>
                                            <span class="material-symbols-outlined text-gray-400" style="font-size: 28px;">grid_view</span>
                                        </div>
                                        <div class="flex items-center gap-2 text-gray-400 text-sm mb-4">
                                            <span class="material-symbols-outlined text-base">sell</span>
                                            <span class="bg-gray-700 text-gray-300 text-xs font-medium px-2 py-0.5 rounded">Pin</span>
                                            <span class="bg-gray-700 text-gray-300 text-xs font-medium px-2 py-0.5 rounded">Tactic</span>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2 text-green-400 text-sm font-medium mt-2">
                                        <div class="size-2 bg-green-400 rounded-full"></div>
                                        <span>123 players currently solving</span>
                                    </div>
                                </div>
                                <div class="bg-surface rounded-lg p-5 flex flex-col justify-between hover:ring-2 hover:ring-primary cursor-pointer transition-all">
                                    <div>
                                        <div class="flex items-center justify-between mb-2">
                                            <h3 class="text-white font-bold text-lg">The Skewer Tactic</h3>
                                            <span class="material-symbols-outlined text-gray-400" style="font-size: 28px;">grid_view</span>
                                        </div>
                                        <div class="flex items-center gap-2 text-gray-400 text-sm mb-4">
                                            <span class="material-symbols-outlined text-base">sell</span>
                                            <span class="bg-gray-700 text-gray-300 text-xs font-medium px-2 py-0.5 rounded">Skewer</span>
                                            <span class="bg-gray-700 text-gray-300 text-xs font-medium px-2 py-0.5 rounded">Advanced</span>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2 text-green-400 text-sm font-medium mt-2">
                                        <div class="size-2 bg-green-400 rounded-full"></div>
                                        <span>175 players currently solving</span>
                                    </div>
                                </div>
                                <div class="bg-surface rounded-lg p-5 flex flex-col justify-between hover:ring-2 hover:ring-primary cursor-pointer transition-all">
                                    <div>
                                        <div class="flex items-center justify-between mb-2">
                                            <h3 class="text-white font-bold text-lg">King Hunt Practice</h3>
                                            <span class="material-symbols-outlined text-gray-400" style="font-size: 28px;">grid_view</span>
                                        </div>
                                        <div class="flex items-center gap-2 text-gray-400 text-sm mb-4">
                                            <span class="material-symbols-outlined text-base">sell</span>
                                            <span class="bg-gray-700 text-gray-300 text-xs font-medium px-2 py-0.5 rounded">Checkmate</span>
                                            <span class="bg-gray-700 text-gray-300 text-xs font-medium px-2 py-0.5 rounded">Attack</span>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2 text-green-400 text-sm font-medium mt-2">
                                        <div class="size-2 bg-green-400 rounded-full"></div>
                                        <span>42 players currently solving</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-5/12 bg-surface border-l border-border flex flex-col">
                        <div class="flex-shrink-0 flex items-center justify-between p-4 border-b border-border">
                            <h3 class="text-white font-semibold">#general-discussion</h3>
                            <button class="text-gray-400 hover:text-white">
                                <span class="material-symbols-outlined">group</span>
                            </button>
                        </div>
                        <div class="flex-grow p-4 overflow-y-auto space-y-6">
                            <div class="flex items-start gap-3">
                                <img class="size-10 rounded-full" data-alt="User avatar 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBa2oDIReRCBRFjN_7Uf3J6JHc9mcUyVmXeSPuZlHKHINNil2ucdDejlQPr5XmAG2hFfO1KulqyRi4x1FUNlLLh5kdHL2GUbosAa-WiuwmayBjZ4OBukbsysyqgepA4bkmfwqjKdFB54ENXEAk1YXVWA32uoVpGRfMmyJXpE90CJQV0jU_35ssYIsByVBfa9QJZdXUskoYg9SWdFmTL2RR16ULfSGTzHtRWV8HMUX3DBX5k2-ABTMU89MtIA0APaO2gqBMyM73G8LA" />
                                <div>
                                    <div class="flex items-baseline gap-2">
                                        <p class="text-primary font-semibold text-sm">ChessMaster123</p>
                                        <p class="text-gray-500 text-xs">10:32 AM</p>
                                    </div>
                                    <p class="text-gray-300">That new "Queen Sacrifice" puzzle is tough! Anyone solve it yet?</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-3">
                                <img class="size-10 rounded-full" data-alt="User avatar 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKW2lydpDKVOjyzmXkuNAXEdl88Jlu6cmBGQtx9UEYPSEyapWXggtI13El6Vn7tJseZSaO8DhUYp39z5ZKgZGKLM3ihq48S1A3Y48AsKK_-M_TDrjAw24__xy2_yFIfsDubkzu1-zUqqf7sT9wCrXlF-aMMaGy7JGw4tJFtLHmvIzL2-nvgKqtt8fU7rBvMaijJxvhR1tMvzA6KneoKEGjPSp6enhC-dtUZ8PwPvTg0eYgnIwQ76knwOARTrPJ0cxEWXVW5lWFgQQ" />
                                <div>
                                    <div class="flex items-baseline gap-2">
                                        <p class="text-green-400 font-semibold text-sm">PawnSlayer</p>
                                        <p class="text-gray-500 text-xs">10:34 AM</p>
                                    </div>
                                    <p class="text-gray-300">Yeah, took me a few tries. The key is the knight move on turn 3.</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-3">
                                <img class="size-10 rounded-full" data-alt="User avatar 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_oRPTFVHaACwibbxOTbtjmhV6wviwgFnMEcS6TBPmX2DVNkho9PHH085xtLTXyl6tiIWk-lN0fg_4nku8N2PjWJ5q7eQvU1pzp7X8vcco6T184kIa1ZOdO3olNO91vJi16shUsHBWfg6f9O5ql-8ZXR5M4WZxJdp-irT4ih2_2OP-c1SyACnSFeShQF9VlIDlaPWKTk6HPUzM64HrRmlrI8quct-ghHJ5NLIZHPf1wSSxIcpA-oZYr8yKDTU6DC0KCGZ1FrY9Cg8" />
                                <div>
                                    <div class="flex items-baseline gap-2">
                                        <p class="text-purple-400 font-semibold text-sm">RookieMoves</p>
                                        <p class="text-gray-500 text-xs">10:35 AM</p>
                                    </div>
                                    <p class="text-gray-300">@ChessMaster123 Don't give up! It feels great when you finally see the solution.</p>
                                </div>
                            </div>
                            <div class="text-center text-sm text-yellow-500 py-2 border-y border-yellow-500/20">
                                PawnSlayer just reached a new high score of 2200!
                            </div>
                            <div class="flex items-start gap-3">
                                <img class="size-10 rounded-full" data-alt="User avatar 4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6QZpvoEclGEwrfQhVy0A0-iAHHAMoXGmxBE337OeiQi0qRuVVdz5NkqrkcXdvbKrmRBZSovp_f4J5RW9Sy5ZNhmkhpNXbEMwlIYkutfRHUc3NACSnlk3FTx6f-49rzp-9D5MebezWzRyhJ78Sa49EhnDcOk1Ibi5cxV86yDZN9k8Q4GNjz9FMqI8jQ6HtqbgjjaBIZ4xf1kqlJDbOLovhKpFNtrGLjQjW1oH_lLY5PBW08aZWpZa5fCtoyPTZK0Y3p9ckNIJViuU" />
                                <div>
                                    <div class="flex items-baseline gap-2">
                                        <p class="text-orange-400 font-semibold text-sm">GrandmasterG</p>
                                        <p class="text-gray-500 text-xs">10:38 AM</p>
                                    </div>
                                    <p class="text-gray-300">Anyone up for a practice match later? Looking to try out a new opening.</p>
                                </div>
                            </div>
                        </div>
                        <div class="flex-shrink-0 p-4 mt-auto">
                            <div class="relative">
                                <input class="w-full h-12 bg-background-dark border border-border rounded-lg text-white placeholder-gray-500 pl-4 pr-12 focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Discuss a puzzle..." type="text" />
                                <button class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary">
                                    <span class="material-symbols-outlined">send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </body></html>