import Link from "next/link";
import { Phone, Bot, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mb-6">
                        <Phone className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">AI Call Center</h1>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Trợ lý chăm sóc khách hàng AI thông minh. Trả lời mọi câu hỏi về sản phẩm, chính sách và FAQ 24/7.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/call">
                            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-lg px-8">
                                <Phone className="mr-2 h-5 w-5" />
                                Bắt đầu cuộc gọi
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white/10">
                                Đăng nhập
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <Card className="bg-white/10 border-white/20 text-white">
                        <CardHeader>
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-2">
                                <Bot className="w-6 h-6" />
                            </div>
                            <CardTitle>AI Thông minh</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-300">Sử dụng AI tiên tiến để trả lời câu hỏi một cách chính xác và tự nhiên.</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/10 border-white/20 text-white">
                        <CardHeader>
                            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-2">
                                <Zap className="w-6 h-6" />
                            </div>
                            <CardTitle>Phản hồi nhanh</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-300">Xử lý giọng nói real-time, trả lời ngay lập tức không cần chờ đợi.</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/10 border-white/20 text-white">
                        <CardHeader>
                            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-2">
                                <Shield className="w-6 h-6" />
                            </div>
                            <CardTitle>Hỗ trợ 24/7</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-300">Luôn sẵn sàng phục vụ mọi lúc, mọi nơi. Hỗ trợ đa ngôn ngữ.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Footer */}
            <footer className="container mx-auto px-4 py-8 text-center text-gray-400 text-sm">
                <p>AI Call Center Demo</p>
            </footer>
        </main>
    );
}
