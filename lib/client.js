window.__ModuleLoader__.load({
	id: "mira-dsh-plugin",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		// src/client/panel.css?raw
		var panel_default = ".msf-root {\n  --msf-ink: var(--dsw-alias-label-primary, #24272d);\n  --msf-muted: var(--dsw-alias-label-secondary, #747980);\n  --msf-subtle: var(--dsw-alias-label-tertiary, #8c9197);\n  --msf-border: var(--dsw-alias-border-l2, rgba(120,126,139,.18));\n  --msf-panel: var(--dsw-alias-bg-layer-1, #fff);\n  --msf-canvas: var(--dsw-alias-bg-base, #faf9f7);\n  --msf-soft: var(--dsw-alias-bg-layer-2, #f4f5f6);\n  --msf-action: var(--dsw-alias-brand-primary, #333d4c);\n  color: var(--msf-ink);\n  background: var(--msf-canvas);\n  min-height: 100%;\n  padding: clamp(20px, 5vw, 52px) clamp(14px, 4vw, 52px) 40px;\n  overflow: auto;\n}\n.msf-root *, .msf-root *::before, .msf-root *::after { box-sizing: border-box }\n.msf-root button, .msf-root input { font: inherit }\n.msf-root h1, .msf-root h2, .msf-root h3, .msf-root p { margin: 0 }\n.msf-root h1 { font-size: clamp(28px, 3vw, 36px); font-weight: 650; letter-spacing: -.04em; line-height: 1.22 }\n.msf-root h2 { font-size: 18px; line-height: 1.4; font-weight: 630; letter-spacing: -.015em }\n.msf-root h3 { font-size: 16px; line-height: 1.5; font-weight: 600; margin: 6px 0 0 }\n.msf-root a { color: inherit; text-decoration: none }\n.msf-root a:hover { text-decoration: underline; text-underline-offset: 3px }\n.msf-root :focus-visible { outline: 2px solid var(--msf-action); outline-offset: 3px }\n.msf-inner { max-width: 1000px; margin: 0 auto }\n.msf-header, .msf-brand, .msf-flex { display: flex; align-items: center }\n.msf-header, .msf-between { justify-content: space-between }\n.msf-header { gap: 20px }\n.msf-brand { gap: 14px }\n.msf-brand-icon {\n  width: 50px; height: 50px; border: 1px solid var(--msf-border);\n  border-radius: 15px; display: grid; place-items: center;\n  color: var(--msf-ink); background: var(--msf-panel);\n}\n.msf-kicker { font-size: 10px; font-weight: 680; letter-spacing: .14em; text-transform: uppercase; color: var(--msf-subtle); margin-bottom: 7px }\n.msf-intro { margin: 12px 0 28px 64px; font-size: 13px; line-height: 1.6; color: var(--msf-muted) }\n.msf-muted { color: var(--msf-muted); font-size: 13px; line-height: 1.65 }\n.msf-mini { font-size: 11px }\n.msf-tabs { display: flex; flex-wrap: wrap; border-bottom: 1px solid var(--msf-border); gap: 26px; margin-bottom: 26px }\n.msf-tab { color: var(--msf-muted); padding: 0 2px 13px; border: 0; background: transparent; font-size: 13px; cursor: pointer; position: relative }\n.msf-tab:hover { color: var(--msf-ink) }\n.msf-tab.msf-active { font-weight: 650; color: var(--msf-ink) }\n.msf-tab.msf-active::after { content: ''; position: absolute; background: var(--msf-ink); height: 2px; left: 0; right: 0; bottom: -1px; border-radius: 4px }\n.msf-chip { display: inline-flex; align-items: center; white-space: nowrap; gap: 6px; border-radius: 99px; border: 1px solid var(--msf-border); color: var(--msf-muted); background: var(--msf-panel); padding: 5px 10px; font-size: 11px; line-height: 1.2; font-weight: 570 }\n.msf-chip.msf-good { color: var(--dsw-alias-state-success-primary, #43836f); border-color: currentColor; background: transparent }\n.msf-chip.msf-warn { color: var(--dsw-alias-state-warn-primary, #98702d); border-color: currentColor; background: transparent }\n.msf-stack { display: grid; gap: 16px }\n.msf-paper { border: 1px solid var(--msf-border); background: var(--msf-panel); border-radius: 15px; padding: clamp(18px, 3vw, 27px); min-width: 0 }\n.msf-paper > p { margin-top: 4px }\n.msf-paper h2 { max-width: 660px }\n.msf-query { display: grid; grid-template-columns: minmax(150px, 2fr) minmax(110px, 1fr) minmax(110px, 1fr) auto; align-items: end; gap: 12px; margin-top: 22px }\n.msf-query label { display: grid; gap: 7px; min-width: 0; color: var(--msf-muted); font-size: 12px; font-weight: 560 }\n.msf-query input {\n  min-width: 0; width: 100%; height: 39px; padding: 0 12px;\n  border-radius: 9px; border: 1px solid var(--msf-border);\n  background: var(--msf-canvas); color: var(--msf-ink);\n  outline-offset: 2px; font-size: 13px;\n}\n.msf-query input::placeholder { color: var(--msf-subtle) }\n.msf-btn { min-height: 39px; padding: 0 16px; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; border: 1px solid var(--msf-border); border-radius: 9px; color: var(--msf-ink); background: var(--msf-panel); cursor: pointer; transition: opacity .15s ease, background .15s ease }\n.msf-btn:hover { background: var(--msf-soft); text-decoration: none !important }\n.msf-btn:disabled { opacity: .48; cursor: not-allowed }\n.msf-btn-primary { background: var(--msf-action); color: var(--dsw-alias-label-primary-foreground, #fff); border-color: transparent }\n.msf-btn-primary:hover { background: var(--dsw-alias-button-primary-hover, var(--msf-action)); opacity: .92 }\n.msf-wrap { flex-wrap: wrap }\n.msf-flex { gap: 12px }\n.msf-gap-sm { gap: 8px }\n.msf-metrics { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 10px; margin: 25px 0 16px; border-top: 1px solid var(--msf-border); padding-top: 19px }\n.msf-metric { min-width: 0 }\n.msf-value { margin-top: 5px; font-weight: 630; font-size: 17px; letter-spacing: -.02em; overflow-wrap: anywhere }\n.msf-action { border: 1px solid var(--msf-border); border-radius: 15px; padding: clamp(20px, 3vw, 30px); background: var(--msf-soft) }\n.msf-action-title { font-size: 23px; font-weight: 630; margin: 8px 0 9px; letter-spacing: -.02em }\n.msf-action p { font-size: 13px; line-height: 1.7; margin-bottom: 5px }\n.msf-actions { display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap }\n.msf-facts { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px 24px; margin-top: 20px }\n.msf-facts > div { display: grid; gap: 6px; padding: 13px 0; border-top: 1px solid var(--msf-border); min-width: 0 }\n.msf-facts span { font-size: 11px; color: var(--msf-muted) }\n.msf-facts b { font-size: 13px; font-weight: 590; overflow-wrap: anywhere }\n.msf-facts code, .msf-root code { font-family: var(--ds-font-family-code, monospace); font-size: 12px; font-weight: 500 }\n.msf-facts-full { grid-template-columns: repeat(3,minmax(0,1fr)) }\n.msf-checks { margin-top: 24px; border-top: 1px solid var(--msf-border); padding-top: 18px }\n.msf-checks > .msf-flex { margin: 13px 0 }\n.msf-checks details { font-size: 12px; color: var(--msf-muted); margin: 10px 0; }\n.msf-checks summary { cursor: pointer; font-weight: 600 }\n.msf-checks details p { line-height: 1.7; margin: 10px 0 }\n.msf-headline { padding: 0 3px 7px }\n.msf-headline p { margin-top: 7px; font-size: 13px; line-height: 1.6; color: var(--msf-muted) }\n.msf-empty { display: grid; justify-items: center; text-align: center; padding: 72px 20px; color: var(--msf-muted); border: 1px dashed var(--msf-border); border-radius: 15px; gap: 12px }\n.msf-empty h2 { color: var(--msf-ink); font-weight: 600 }\n.msf-empty p { max-width: 450px; font-size: 13px; line-height: 1.7 }\n.msf-alert { border: 1px solid var(--dsw-alias-state-warn-primary, #98702d); color: var(--msf-ink); background: var(--msf-panel); padding: 14px 17px; border-radius: 10px; font-size: 12px; line-height: 1.6 }\n.msf-alert ul { margin: 8px 0 0; padding-left: 18px }\n.msf-text-button { border: none; cursor: pointer; color: var(--msf-ink); background: transparent; width: max-content; font-size: 12px; padding: 9px 0; font-weight: 650 }\n.msf-text-button:hover { text-decoration: underline }\n.msf-list { margin: 15px 0 0; padding-left: 19px; font-size: 13px; line-height: 2; color: var(--msf-muted) }\n.msf-footer { border-top: 1px solid var(--msf-border); margin-top: 34px; padding-top: 17px; font-size: 11px; color: var(--msf-subtle) }\n@media (max-width: 820px) {\n  .msf-query { grid-template-columns: repeat(2,minmax(0,1fr)) }\n  .msf-query label:first-child { grid-column: 1/-1 }\n  .msf-query .msf-btn { grid-column: 1/-1 }\n  .msf-facts-full { grid-template-columns: 1fr }\n}\n@media (max-width: 540px) {\n  .msf-header { align-items: flex-start }\n  .msf-intro { margin-left: 0 }\n  .msf-brand-icon { width: 42px; height: 42px }\n  .msf-tabs { gap: 13px }\n  .msf-query { grid-template-columns: 1fr }\n  .msf-query label:first-child, .msf-query .msf-btn { grid-column: auto }\n  .msf-facts, .msf-metrics { grid-template-columns: 1fr 1fr }\n  .msf-facts-full { grid-template-columns: 1fr }\n}\n@media (prefers-reduced-motion: reduce) { .msf-btn { transition: none } }\n";
		// src/client/index.tsx
		const PANEL = "mira-supa-foreman";
		const STATE = {
			draft_pr_exists: {
				label: "已有 Draft PR",
				hint: "继续现有实现与审查；禁止重复派工。"
			},
			review_pending: {
				label: "等待审查",
				hint: "已有 PR，独立审查尚未完成。"
			},
			pr_needs_attention: {
				label: "需要处理",
				hint: "检查失败项或已提出的修改要求。"
			},
			ci_pending: {
				label: "检查进行中",
				hint: "等待现有 PR 的检查结果。"
			},
			maintainer_assessment: {
				label: "等待维护者判断",
				hint: "审查证据不等于验收，仍需独立核对。"
			},
			multiple_open_prs: {
				label: "多个 PR",
				hint: "先处理并行 PR 的归属与冲突。"
			},
			merged_pr_issue_open: {
				label: "PR 已合并",
				hint: "核对工作项结果，不要再次施工。"
			},
			only_closed_prs: {
				label: "只有已关闭的 PR",
				hint: "先核实历史处理结果。"
			},
			no_linked_pr: {
				label: "未找到关联 PR",
				hint: "仍不能推断可以自动施工。"
			},
			needs_investigation: {
				label: "证据不完整",
				hint: "检查数据源、权限和关联关系。"
			},
			issue_not_open: {
				label: "Issue 非开放",
				hint: "不得未经新授权重复施工。"
			}
		};
		const terms = {
			task: "任务概览",
			evidence: "验收证据",
			settings: "连接与限制"
		};
		async function getJson(path, signal) {
			const response = await fetch(path, {
				method: "GET",
				headers: { "x-mira-supa-request": "1" },
				signal
			});
			const value = await response.json();
			if (!response.ok) throw new Error(value?.error || "查询失败（HTTP " + response.status + "）");
			return value;
		}
		function ForemanIcon({ size = 20 }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				width: size,
				height: size,
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: 1.7,
				strokeLinecap: "round",
				strokeLinejoin: "round",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M4 14.5a8 8 0 0 1 16 0M8 14V9.2m8 4.8V9.2M3 15h18v2H3zM8 20h8" })
			});
		}
		function Chip({ children, tone = "neutral" }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "msf-chip msf-" + tone,
				children
			});
		}
		function StatusText({ state }) {
			const item = STATE[state];
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: item?.label ?? state });
		}
		function Info({ label, value }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "msf-metric",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "msf-muted msf-mini",
					children: label
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "msf-value",
					children: value
				})]
			});
		}
		function ShortSha({ value }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
				title: value ?? void 0,
				children: value ? value.slice(0, 8) : "未知"
			});
		}
		function ActionBar({ snapshot }) {
			const state = STATE[snapshot.decision.state];
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "msf-action",
				"aria-label": "建议操作",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "msf-kicker",
						children: "NEXT ACTION / 建议操作"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "msf-action-title",
						children: state?.label ?? snapshot.decision.state
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: snapshot.decision.action }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "msf-muted",
						children: state?.hint ?? "请核对真实任务契约。"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "msf-actions",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
							href: snapshot.issue.url,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "msf-btn msf-btn-primary",
							children: "打开 Issue"
						}), snapshot.related_prs[0] && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
							href: snapshot.related_prs[0].pr.number ? snapshot.related_prs[0].url : snapshot.issue.url,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "msf-btn",
							children: "查看关联 PR"
						})]
					})
				]
			});
		}
		function Evidence({ snapshot }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "msf-stack",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "msf-headline",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "证据不是验收" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "提交、检查与 Review 必须绑定到具体 PR；最终由维护者判断。" })]
				}), snapshot.related_prs.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "msf-empty",
					children: "当前可见的 GitHub 时间线中未找到关联 PR。未找到不代表已授权新施工。"
				}) : snapshot.related_prs.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
					className: "msf-paper",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "msf-flex msf-between msf-wrap",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "msf-kicker",
								children: ["PULL REQUEST #", item.pr.number]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
								href: item.url,
								target: "_blank",
								rel: "noopener noreferrer",
								children: item.pr.title
							}) })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Chip, {
								tone: item.pr.draft ? "warn" : "neutral",
								children: item.pr.draft ? "Draft" : item.pr.state
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "msf-facts",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "目标分支" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: item.pr.base })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "当前 Head" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ShortSha, { value: item.pr.head_sha })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "正式 Review" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: item.reviews.available ? item.reviews.submitted ?? 0 : "不可用" })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "当前 Head 批准" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: item.reviews.available ? item.reviews.approvals_on_head ?? 0 : "不可用" })] })
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "msf-checks",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "msf-kicker",
									children: "CI / CHECK RUNS"
								}),
								item.checks.available ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "msf-flex msf-wrap msf-gap-sm",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Chip, {
												tone: "good",
												children: [item.checks.successful ?? 0, " 通过"]
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Chip, { children: [item.checks.skipped?.length ?? 0, " 跳过"] }),
											(item.checks.failed?.length ?? 0) > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Chip, {
												tone: "warn",
												children: [item.checks.failed?.length, " 失败"]
											}),
											(item.checks.pending?.length ?? 0) > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Chip, { children: [item.checks.pending?.length, " 运行中"] })
										]
									}),
									(item.checks.failed?.length ?? 0) > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
										className: "msf-alert",
										children: ["失败检查：", item.checks.failed?.join("、")]
									}),
									(item.checks.skipped?.length ?? 0) > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: "查看跳过的检查" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: item.checks.skipped?.join("、") })] })
								] }) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
									className: "msf-alert",
									children: ["检查数据不可用：", item.checks.error]
								}),
								!item.reviews.available && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
									className: "msf-alert",
									children: ["Review 数据不可用：", item.reviews.error]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: "msf-muted msf-mini",
									children: "Skipped 不自动视为缺陷；绿灯不代表代码验收。这是 PR Head 的实时证据快照。"
								})
							]
						})
					]
				}, item.pr.number))]
			});
		}
		function ProjectStatus() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "msf-facts msf-facts-full",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "GitHub Project Status" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: "未连接 · 不推断" })] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Super Agent Worker" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: "未连接 · 不显示假进度" })] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "写入与派工" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: "尚未启用" })] })
				]
			});
		}
		function ForemanPanel() {
			const [page, setPage] = (0, react.useState)("task");
			const [repo, setRepo] = (0, react.useState)("uichat-mira/folio");
			const [issue, setIssue] = (0, react.useState)("");
			const [branch, setBranch] = (0, react.useState)("dev");
			const [busy, setBusy] = (0, react.useState)(false);
			const [snapshot, setSnapshot] = (0, react.useState)(null);
			const [error, setError] = (0, react.useState)("");
			const [health, setHealth] = (0, react.useState)(null);
			const [healthError, setHealthError] = (0, react.useState)("");
			const active = (0, react.useRef)(null);
			(0, react.useEffect)(() => () => active.current?.abort(), []);
			async function inspect(event) {
				event?.preventDefault();
				active.current?.abort();
				const controller = new AbortController();
				active.current = controller;
				setBusy(true);
				setError("");
				setSnapshot(null);
				try {
					const result = await getJson("/mira-supa/api/task?" + new URLSearchParams({
						repo: repo.trim(),
						issue: issue.trim(),
						branch: branch.trim()
					}).toString(), controller.signal);
					if (active.current === controller) {
						setSnapshot(result);
						setPage("task");
					}
				} catch (err) {
					if (active.current === controller && !controller.signal.aborted) setError(err instanceof Error ? err.message : String(err));
				} finally {
					if (active.current === controller) setBusy(false);
				}
			}
			(0, react.useEffect)(() => {
				if (page !== "settings") return;
				const controller = new AbortController();
				setHealthError("");
				getJson("/mira-supa/api/health", controller.signal).then(setHealth).catch((err) => {
					if (!controller.signal.aborted) setHealthError(String(err));
				});
				return () => controller.abort();
			}, [page]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "msf-root",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("style", { children: panel_default }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "msf-inner",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
							className: "msf-header",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "msf-brand",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "msf-brand-icon",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ForemanIcon, { size: 23 })
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "msf-kicker",
									children: "MIRA / SUPA FOREMAN"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("h1", { children: "速趴工头" })] })]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Chip, { children: "只读 · v0.3" })]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "msf-intro",
							children: "任务有来处，施工有去向，交付有证据。"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("nav", {
							className: "msf-tabs",
							"aria-label": "速趴工头",
							children: Object.keys(terms).map((key) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: page === key ? "msf-tab msf-active" : "msf-tab",
								"aria-current": page === key ? "page" : void 0,
								onClick: () => setPage(key),
								children: terms[key]
							}, key))
						}),
						page === "task" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "msf-stack",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
									className: "msf-paper",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
											className: "msf-kicker",
											children: "INSPECT / 查询任务"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
											className: "msf-muted",
											children: "从 GitHub Issue 出发，自动查找关联 PR 和当前证据。不创建新的任务台账。"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("form", {
											className: "msf-query",
											onSubmit: inspect,
											children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: ["仓库", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
													value: repo,
													onChange: (e) => setRepo(e.target.value),
													required: true,
													placeholder: "uichat-mira/folio"
												})] }),
												/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: ["Issue 编号", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
													value: issue,
													onChange: (e) => setIssue(e.target.value),
													required: true,
													inputMode: "numeric",
													pattern: "[1-9][0-9]*",
													placeholder: "例如 124"
												})] }),
												/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: ["分支", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
													value: branch,
													onChange: (e) => setBranch(e.target.value),
													required: true,
													placeholder: "dev"
												})] }),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
													type: "submit",
													className: "msf-btn msf-btn-primary",
													disabled: busy || !issue.trim(),
													children: busy ? "正在查询…" : "检查任务"
												})
											]
										})
									]
								}),
								error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "msf-alert",
									role: "alert",
									children: error
								}),
								snapshot ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
										className: "msf-paper",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
												className: "msf-flex msf-between msf-wrap",
												children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
													className: "msf-kicker",
													children: [
														"ISSUE #",
														snapshot.issue.number,
														" · ",
														snapshot.issue.state.toUpperCase()
													]
												}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: snapshot.issue.title })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Chip, {
													tone: snapshot.decision.state.includes("attention") || snapshot.decision.state.includes("investigation") ? "warn" : "neutral",
													children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(StatusText, { state: snapshot.decision.state })
												})]
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
												className: "msf-metrics",
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Info, {
														label: "关联 PR",
														value: snapshot.related_prs.length
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Info, {
														label: "当前分支",
														value: snapshot.policy.branch
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Info, {
														label: "Org 规则",
														value: snapshot.policy.org_sha.slice(0, 8)
													})
												]
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
												className: "msf-muted msf-mini",
												children: [
													"读取时间：",
													new Date(snapshot.checked_at).toLocaleString(),
													" · 仓库规则：",
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ShortSha, { value: snapshot.policy.repo_sha })
												]
											})
										]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ActionBar, { snapshot }),
									snapshot.warnings.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "msf-alert",
										role: "status",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "证据缺口" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", { children: snapshot.warnings.map((v, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: v }, i)) })]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
										className: "msf-paper",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
											className: "msf-kicker",
											children: "SOURCE OF TRUTH / 状态边界"
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ProjectStatus, {})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										className: "msf-text-button",
										type: "button",
										onClick: () => setPage("evidence"),
										children: "查看 PR、CI 与 Review 证据 →"
									})
								] }) : !busy && !error && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "msf-empty",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ForemanIcon, { size: 32 }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "先给工头一张任务卡" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "输入仓库与 Issue 编号，看看活儿进行到哪一步。现阶段只读，不会派牛马。" })
									]
								})
							]
						}),
						page === "evidence" && (snapshot ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Evidence, { snapshot }) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "msf-empty",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "先读取一张任务卡" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "切到「任务概览」查询 Issue，才能看到真实 PR 证据。" })]
						})),
						page === "settings" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "msf-stack",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
								className: "msf-paper",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: "msf-kicker",
										children: "CONNECTION / 当前连接"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "只读工程伴侣" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
										className: "msf-muted",
										children: "UI 通过本机 DSH Host 查询 GitHub，不在浏览器保存 Token、密钥或任务副本。"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "msf-facts msf-facts-full",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Host API" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: health ? "已连接 · " + health.version : healthError ? "不可用" : "检查中" })] }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "执行权限" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: "只读" })] }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "GitHub Project / Super Agent" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: "未接入" })] })
										]
									}),
									healthError && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
										className: "msf-alert",
										children: healthError
									})
								]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
								className: "msf-paper",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "msf-kicker",
									children: "SAFE BY DESIGN / 能力边界"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("ul", {
									className: "msf-list",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: "任务状态由 Issue / PR / GitHub 规则产生，不猜测 Project Status。" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: "CI / Review 是证据，不自动算维护者验收。" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: "没有自动施工、会话暂停、恢复、合并或关闭功能。" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: "现有 DSH 会话不会因打开此面板被操作。" })
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("footer", {
							className: "msf-footer",
							children: "Mira 速趴 · 工头只负责认清现场，真正施工留给后续安全接入。"
						})
					]
				})]
			});
		}
		const inject = ["slots"];
		function apply(ctx) {
			ctx.slots.inject("main", () => ctx.slots.register({
				name: "main",
				key: PANEL,
				inject: () => ({})
			}, () => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ForemanPanel, {})));
			ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
				name: "sidebar.panellist",
				id: PANEL,
				order: 15,
				label: () => "速趴工头"
			}, ForemanIcon));
		}
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
